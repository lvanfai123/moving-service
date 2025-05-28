import Link from "next/link"
import { ArrowRight, Clock, DollarSign, Shield, Users, Star, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HomeQuoteForm } from "@/components/home-quote-form"
import { ServiceProcess } from "@/components/service-process"
import { PartnerLogo } from "@/components/partner-logo"

export default function HomePage() {
  // 合作夥伴數據
  const partners = [
    {
      id: "P001",
      name: "安心搬運",
      logo: "/images/partners/anxin-moving.png",
    },
    {
      id: "P002",
      name: "專業搬運有限公司",
      logo: "/images/partners/professional-moving-ltd.png",
    },
    {
      id: "P003",
      name: "快捷搬運服務",
      logo: "/images/partners/quick-moving-service.png",
    },
    {
      id: "P004",
      name: "優質搬運",
      logo: "/images/partners/quality-moving.png",
    },
    {
      id: "P005",
      name: "安全搬運",
      logo: "/images/partners/safe-moving.png",
    },
    {
      id: "P006",
      name: "信譽搬運",
      logo: "/images/partners/reputable-moving.png",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-modern-living-room.jpeg')",
        }}
      >
        {/* Background Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary/30"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-white text-sm font-medium">#1 香港搬屋配對平台</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white drop-shadow-lg">
                香港最專業的搬屋配對平台
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl drop-shadow-md">
                一小時內為您提供至少三份報價，讓您輕鬆比較價格和服務，選擇最適合的搬運公司
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  立即獲取報價
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/promises">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white shadow-lg backdrop-blur-sm bg-white/90"
                >
                  了解服務承諾
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">為什麼選擇我們？</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary-100">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">完全免費</h3>
                    <p className="text-gray-600">無需支付任何中介費用，完全免費為您配對最適合的搬運公司</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-secondary-100">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-secondary shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">快速報價</h3>
                    <p className="text-gray-600">一小時內為您提供至少三份報價，節省您寶貴的時間</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-tertiary-200">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-tertiary-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">品質保證</h3>
                    <p className="text-gray-600">所有合作搬運公司均經過嚴格審核，確保服務品質</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">簡單四步，輕鬆搬屋</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"></div>
          </div>
          <ServiceProcess />
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-tertiary-100">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                免費獲取專業報價
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                立即獲取報價
              </h2>
              <p className="text-gray-600 md:text-xl">填寫您的搬運需求，我們將在一小時內為您提供至少三份報價</p>
              <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4"></div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-2">
              <HomeQuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium">
                <Users className="h-4 w-4 mr-2" />
                值得信賴的合作夥伴
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                信賴的合作夥伴
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                我們與香港多家優質搬運公司合作，為您提供專業可靠的搬運服務
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
                {partners.map((partner) => (
                  <div key={partner.id} className="group">
                    <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <PartnerLogo src={partner.logo} alt={partner.name} size="md" />
                      <p className="text-sm text-gray-600 text-center font-medium">{partner.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-8 bg-white rounded-full px-6 py-3 shadow-md">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">已有超過 50+ 家搬運公司加入我們的平台</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-primary via-primary-600 to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full bg-repeat"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我們的成就</h2>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-12">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-white/90">成功配對</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/90">合作夥伴</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-4xl font-bold mb-2">4.8</div>
                <div className="text-white/90">平均評分</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-white/90">客戶支援</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                  <Star className="h-4 w-4 mr-2" />
                  開始您的搬運之旅
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  準備開始您的搬運之旅？
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
                  立即提交您的搬運需求，讓我們為您找到最適合的搬運公司
                </p>
              </div>
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4"
                >
                  立即獲取報價
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
