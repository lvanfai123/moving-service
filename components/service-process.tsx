import { CheckCircle, ClipboardCheck, Clock, Truck, UserCheck } from "lucide-react"

export function ServiceProcess() {
  const steps = [
    {
      icon: <ClipboardCheck className="h-8 w-8 text-primary" />,
      title: "填寫需求",
      description: "提交您的搬運需求",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "系統發送到合作伙伴",
      description: "需求發送給搬運公司",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "搬屋公司報價",
      description: "1小時內提供報價",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "選擇報價",
      description: "選擇最合適的公司",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "繳付訂金",
      description: "確認預訂並支付",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "完成搬運",
      description: "按約定完成搬運",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "用戶評分",
      description: "為服務評分",
    },
  ]

  return (
    <div className="mt-10 max-w-6xl mx-auto">
      {/* Desktop view - horizontal layout */}
      <div className="hidden md:flex flex-row justify-between items-start w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center relative px-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 z-10">
              {step.icon}
            </div>
            <h3 className="mt-4 font-medium text-sm lg:text-base whitespace-nowrap">{step.title}</h3>
            <p
              className="mt-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
              style={{ maxWidth: "150px" }}
            >
              {step.description}
            </p>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-0.5 bg-secondary dark:bg-secondary-700" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile view - vertical layout */}
      <div className="md:hidden space-y-6 mx-auto max-w-md">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 z-10">
              {step.icon}
            </div>
            <div>
              <h3 className="font-medium whitespace-nowrap">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-[250px]">
                {step.description}
              </p>
            </div>

            {/* Vertical connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute top-10 left-5 h-[calc(100%+1.5rem)] w-0.5 bg-secondary dark:bg-secondary-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServiceProcess
