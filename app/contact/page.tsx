import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, MessageSquare, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">聯絡我們</h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl max-w-2xl mx-auto">
            如有任何疑問或需要協助，請隨時與我們聯絡，我們將盡快回覆您
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium">地址</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        九龍新蒲崗大有街31號善美工業大廈20樓A座21室
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium">電話</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <a href="tel:66668888" className="hover:underline">
                          6666 8888
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium">WhatsApp</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <a href="https://wa.me/85266668888" className="hover:underline">
                          6666 8888
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium">電郵</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <a href="mailto:info@movingec.com" className="hover:underline">
                          info@movingec.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium">辦公時間</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">星期一至六: 10:00 - 20:00</p>
                      <p className="text-gray-500 dark:text-gray-400">星期日及勞工假期: 休息</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.0456351886!2d114.19658!3d22.33553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340406dd3c6e3d1d%3A0x5b1e9c3c7f0d7f0a!2z5paw6JOu5bO25aSn5pyJ6KGX!5e0!3m2!1szh-TW!2shk!4v1621234567890!5m2!1szh-TW!2shk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">發送訊息</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">填寫以下表格，我們將盡快回覆您</p>
                </div>

                <form className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input id="name" placeholder="請輸入姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">電郵</Label>
                      <Input id="email" type="email" placeholder="請輸入電郵" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">電話</Label>
                      <Input id="phone" placeholder="請輸入電話" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">主題</Label>
                      <Input id="subject" placeholder="請輸入主題" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">訊息</Label>
                      <Textarea id="message" placeholder="請輸入訊息內容" rows={5} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-600">
                    發送訊息
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
