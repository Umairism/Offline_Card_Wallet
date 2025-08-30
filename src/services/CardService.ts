import SQLite from 'react-native-sqlite-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

// Enable promise for SQLite
SQLite.enablePromise(true);

export interface Card {
  id?: number;
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  type: 'credit' | 'debit' | 'loyalty' | 'membership';
  category?: string;
  color?: string;
  lastFour: string;
  createdAt?: string;
  updatedAt?: string;
}

export class CardService {
  private static db: SQLite.SQLiteDatabase | null = null;
  private static readonly DB_NAME = 'OfflineCardWallet.db';
  private static readonly DB_VERSION = '1.0';
  private static readonly DB_DISPLAY_NAME = 'Offline Card Wallet Database';

  static async initDatabase() {
    try {
      if (this.db) return this.db;

      this.db = await SQLite.openDatabase({
        name: this.DB_NAME,
        version: this.DB_VERSION,
        displayName: this.DB_DISPLAY_NAME,
        location: 'default',
      });

      await this.createTables();
      return this.db;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private static async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    const createCardsTable = `
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        number TEXT NOT NULL,
        expiry_month TEXT NOT NULL,
        expiry_year TEXT NOT NULL,
        cvv TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT,
        color TEXT DEFAULT '#007AFF',
        last_four TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id INTEGER,
        amount REAL,
        currency TEXT DEFAULT 'USD',
        merchant_name TEXT,
        transaction_type TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES cards (id)
      );
    `;

    await this.db.executeSql(createCardsTable);
    await this.db.executeSql(createTransactionsTable);
  }

  static async addCard(card: Omit<Card, 'id' | 'lastFour' | 'createdAt' | 'updatedAt'>): Promise<number> {
    try {
      await this.initDatabase();
      if (!this.db) throw new Error('Database not initialized');

      // Encrypt sensitive data
      const encryptedNumber = await this.encryptData(card.number);
      const encryptedCvv = await this.encryptData(card.cvv);
      const lastFour = card.number.slice(-4);

      const insertSQL = `
        INSERT INTO cards (name, number, expiry_month, expiry_year, cvv, type, category, color, last_four)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await this.db.executeSql(insertSQL, [
        card.name,
        encryptedNumber,
        card.expiryMonth,
        card.expiryYear,
        encryptedCvv,
        card.type,
        card.category || '',
        card.color || '#007AFF',
        lastFour,
      ]);

      return result[0].insertId;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }

  static async getAllCards(): Promise<Card[]> {
    try {
      await this.initDatabase();
      if (!this.db) throw new Error('Database not initialized');

      const selectSQL = 'SELECT * FROM cards ORDER BY created_at DESC';
      const result = await this.db.executeSql(selectSQL);

      const cards: Card[] = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        const row = result[0].rows.item(i);
        
        // Decrypt sensitive data
        const decryptedNumber = await this.decryptData(row.number);
        const decryptedCvv = await this.decryptData(row.cvv);

        cards.push({
          id: row.id,
          name: row.name,
          number: decryptedNumber,
          expiryMonth: row.expiry_month,
          expiryYear: row.expiry_year,
          cvv: decryptedCvv,
          type: row.type,
          category: row.category,
          color: row.color,
          lastFour: row.last_four,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }

      return cards;
    } catch (error) {
      console.error('Error getting cards:', error);
      throw error;
    }
  }

  static async getCardById(id: number): Promise<Card | null> {
    try {
      await this.initDatabase();
      if (!this.db) throw new Error('Database not initialized');

      const selectSQL = 'SELECT * FROM cards WHERE id = ?';
      const result = await this.db.executeSql(selectSQL, [id]);

      if (result[0].rows.length === 0) return null;

      const row = result[0].rows.item(0);
      const decryptedNumber = await this.decryptData(row.number);
      const decryptedCvv = await this.decryptData(row.cvv);

      return {
        id: row.id,
        name: row.name,
        number: decryptedNumber,
        expiryMonth: row.expiry_month,
        expiryYear: row.expiry_year,
        cvv: decryptedCvv,
        type: row.type,
        category: row.category,
        color: row.color,
        lastFour: row.last_four,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error getting card by ID:', error);
      throw error;
    }
  }

  static async deleteCard(id: number): Promise<void> {
    try {
      await this.initDatabase();
      if (!this.db) throw new Error('Database not initialized');

      const deleteSQL = 'DELETE FROM cards WHERE id = ?';
      await this.db.executeSql(deleteSQL, [id]);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  static async getCardCount(): Promise<number> {
    try {
      await this.initDatabase();
      if (!this.db) throw new Error('Database not initialized');

      const countSQL = 'SELECT COUNT(*) as count FROM cards';
      const result = await this.db.executeSql(countSQL);
      
      return result[0].rows.item(0).count;
    } catch (error) {
      console.error('Error getting card count:', error);
      return 0;
    }
  }

  private static async encryptData(data: string): Promise<string> {
    try {
      // For now, we'll use base64 encoding as a placeholder
      // In production, use proper AES encryption
      return Buffer.from(data).toString('base64');
    } catch (error) {
      console.error('Error encrypting data:', error);
      return data;
    }
  }

  private static async decryptData(encryptedData: string): Promise<string> {
    try {
      // For now, we'll use base64 decoding as a placeholder
      // In production, use proper AES decryption
      return Buffer.from(encryptedData, 'base64').toString();
    } catch (error) {
      console.error('Error decrypting data:', error);
      return encryptedData;
    }
  }

  static async backupCards(): Promise<string> {
    try {
      const cards = await this.getAllCards();
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        cards: cards.map(card => ({
          ...card,
          number: await this.encryptData(card.number),
          cvv: await this.encryptData(card.cvv),
        })),
      };

      return JSON.stringify(backup);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  static async restoreCards(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      
      for (const cardData of backup.cards) {
        const card = {
          name: cardData.name,
          number: await this.decryptData(cardData.number),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          cvv: await this.decryptData(cardData.cvv),
          type: cardData.type,
          category: cardData.category,
          color: cardData.color,
        };

        await this.addCard(card);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }
}
