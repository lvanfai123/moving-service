import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function FooterComponent() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              一小時內獲取至少三份報價，輕鬆找到最合適的搬運公司
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  立即獲取報價
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  成為合作伙伴
                </Link>
              </li>
              <li>
                <Link
                  href="/promises"
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  服務承諾
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">聯絡資訊</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500 dark:text-gray-400">
                地址：九龍新蒲崗大有街31號善美工業大廈20樓A座21室
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                電話：
                <a href="tel:66668888" className="hover:text-primary dark:hover:text-primary-400">
                  6666 8888
                </a>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                WhatsApp：
                <a href="https://wa.me/85266668888" className="hover:text-primary dark:hover:text-primary-400">
                  6666 8888
                </a>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                電郵：
                <a href="mailto:info@movingec.com" className="hover:text-primary dark:hover:text-primary-400">
                  info@movingec.com
                </a>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                辦公時間：星期一至六 10:00-20:00，勞工假期休息
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">關注我們</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} 搬屋師 (MovingEC). 版權所有.
          </p>
        </div>
      </div>
    </footer>
  )
}
