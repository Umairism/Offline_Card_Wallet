"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { MobileHeader } from "@/components/mobile-header"
import { MobileNav } from "@/components/mobile-nav"
import { WalletCard } from "@/components/wallet-card"
import { DashboardStats } from "@/components/dashboard-stats"
import { SpendingInsights } from "@/components/spending-insights"
import { QuickActionsGrid } from "@/components/quick-actions-grid"
import { RecentActivity } from "@/components/recent-activity"
import { CardManagementScreen } from "@/components/card-management-screen"
import { QRPaymentScreen } from "@/components/qr-payment-screen"
import { NFCPaymentScreen } from "@/components/nfc-payment-screen"
import { LoyaltyCardsScreen } from "@/components/loyalty-cards-screen"
import { Button } from "@/components/ui/button"
import { Plus, HistoryIcon } from "lucide-react"

type AppState = "splash" | "onboarding" | "main"

export default function OfflineCardWallet() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (appState === "splash") {
    return <SplashScreen onComplete={() => setAppState("onboarding")} />
  }

  if (appState === "onboarding") {
    return <OnboardingFlow onComplete={() => setAppState("main")} />
  }

  const sampleCards = [
    {
      cardNumber: "4532123456789012",
      cardHolder: "JOHN DOE",
      expiryDate: "12/28",
      cardType: "visa" as const,
      balance: "$2,450.00",
      nickname: "Main Card",
    },
    {
      cardNumber: "5555444433221111",
      cardHolder: "JOHN DOE",
      expiryDate: "09/27",
      cardType: "mastercard" as const,
      balance: "$890.50",
      nickname: "Shopping Card",
    },
    {
      cardNumber: "378282246310005",
      cardHolder: "JOHN DOE",
      expiryDate: "03/29",
      cardType: "amex" as const,
      balance: "$1,250.75",
      nickname: "Business Card",
    },
  ]

  const renderDashboard = () => (
    <div className="space-y-6 pb-20">
      {/* Enhanced Stats Dashboard */}
      <DashboardStats
        totalCards={sampleCards.length}
        totalBalance="$4,591.25"
        monthlySpending="$1,126.83"
        spendingTrend="up"
        securityScore={98}
      />

      {/* Enhanced Cards Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-lg font-semibold">My Cards</h2>
            <p className="text-sm text-muted-foreground">Swipe to view all cards</p>
          </div>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setCurrentPage("cards")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Card
          </Button>
        </div>

        <div className="flex gap-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {sampleCards.map((card, index) => (
            <div key={index} className="flex-shrink-0">
              <WalletCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <QuickActionsGrid
        onActionClick={(action) => {
          switch (action) {
            case "scan-qr":
              setCurrentPage("qr")
              break
            case "nfc-pay":
              setCurrentPage("nfc")
              break
            case "add-card":
              setCurrentPage("cards")
              break
            default:
              console.log(`Action: ${action}`)
          }
        }}
      />

      {/* Spending Insights */}
      <div className="px-4">
        <SpendingInsights />
      </div>

      {/* Enhanced Recent Activity */}
      <div className="px-4">
        <RecentActivity onViewAll={() => setCurrentPage("history")} />
      </div>
    </div>
  )

  const renderPlaceholder = (title: string) => (
    <div className="flex-1 flex items-center justify-center pb-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <HistoryIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard()
      case "cards":
        return <CardManagementScreen onBack={() => setCurrentPage("dashboard")} />
      case "qr":
        return <QRPaymentScreen onBack={() => setCurrentPage("dashboard")} />
      case "nfc":
        return <NFCPaymentScreen onBack={() => setCurrentPage("dashboard")} />
      case "loyalty":
        return <LoyaltyCardsScreen onBack={() => setCurrentPage("dashboard")} />
      case "history":
        return renderPlaceholder("Transaction History")
      default:
        return renderDashboard()
    }
  }

  const shouldShowHeader = !["cards", "qr", "nfc", "loyalty"].includes(currentPage)
  const shouldShowNav = !["cards", "qr", "nfc", "loyalty"].includes(currentPage)

  return (
    <div className="min-h-screen bg-background">
      {appState === "main" && shouldShowHeader && (
        <MobileHeader title="Offline Card Wallet" onSettingsClick={() => setCurrentPage("settings")} />
      )}

      <main className="flex-1">{appState === "main" && renderContent()}</main>

      {appState === "main" && shouldShowNav && <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />}
    </div>
  )
}
