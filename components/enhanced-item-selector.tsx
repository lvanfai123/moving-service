"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import { ITEM_CATEGORIES } from "@/lib/items-config"
import type { QuoteRequestItem } from "@/types/quote-request"

interface EnhancedItemSelectorProps {
  items: QuoteRequestItem[]
  onItemsChange: (items: QuoteRequestItem[]) => void
}

export function EnhancedItemSelector({ items, onItemsChange }: EnhancedItemSelectorProps) {
  const addItem = () => {
    const newItem: QuoteRequestItem = {
      id: `item-${Date.now()}`,
      category: "",
      type: "",
      quantity: 1,
      needDisposal: false,
    }
    onItemsChange([...items, newItem])
  }

  const updateItem = (index: number, updates: Partial<QuoteRequestItem>) => {
    const updatedItems = items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    onItemsChange(updatedItems)
  }

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const getItemsForCategory = (category: string) => {
    return ITEM_CATEGORIES[category as keyof typeof ITEM_CATEGORIES]?.items || []
  }

  const getSelectedItemConfig = (category: string, type: string) => {
    const categoryItems = getItemsForCategory(category)
    return categoryItems.find((item) => item.value === type)
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">搬運物品清單</Label>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">尚未添加任何物品</p>
            <Button onClick={addItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              添加第一個物品
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {items.map((item, index) => {
            const selectedItemConfig = getSelectedItemConfig(item.category, item.type)
            const isLastItem = index === items.length - 1

            return (
              <div key={item.id} className="space-y-4">
                <Card className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">物品 {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>物品類別</Label>
                        <Select
                          value={item.category}
                          onValueChange={(value) => updateItem(index, { category: value, type: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇物品類別" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                              <SelectItem key={key} value={key}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>具體物品</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => updateItem(index, { type: value })}
                          disabled={!item.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇具體物品" />
                          </SelectTrigger>
                          <SelectContent>
                            {getItemsForCategory(item.category).map((itemType) => (
                              <SelectItem key={itemType.value} value={itemType.value}>
                                {itemType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>數量</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, { quantity: Number.parseInt(e.target.value) || 1 })}
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id={`disposal-${item.id}`}
                          checked={item.needDisposal}
                          onCheckedChange={(checked) => updateItem(index, { needDisposal: !!checked })}
                        />
                        <Label htmlFor={`disposal-${item.id}`} className="text-sm font-medium text-red-600">
                          需要棄置此物品
                        </Label>
                      </div>
                    </div>

                    {/* 尺寸輸入 - 針對需要尺寸的物品 */}
                    {selectedItemConfig?.needsSize && (
                      <div className="space-y-2">
                        <Label>尺寸 (呎)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="長"
                            type="number"
                            value={item.dimensions?.length || ""}
                            onChange={(e) =>
                              updateItem(index, {
                                dimensions: {
                                  ...item.dimensions,
                                  length: Number.parseFloat(e.target.value) || undefined,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="闊"
                            type="number"
                            value={item.dimensions?.width || ""}
                            onChange={(e) =>
                              updateItem(index, {
                                dimensions: {
                                  ...item.dimensions,
                                  width: Number.parseFloat(e.target.value) || undefined,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="高"
                            type="number"
                            value={item.dimensions?.height || ""}
                            onChange={(e) =>
                              updateItem(index, {
                                dimensions: {
                                  ...item.dimensions,
                                  height: Number.parseFloat(e.target.value) || undefined,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* 容量輸入 - 針對需要容量的櫃類 */}
                    {selectedItemConfig?.needsCapacity && (
                      <div className="space-y-2">
                        <Label>容量 (人數)</Label>
                        <Input
                          placeholder="請輸入可容納人數"
                          type="number"
                          min="1"
                          value={item.notes || ""}
                          onChange={(e) => updateItem(index, { notes: e.target.value })}
                        />
                      </div>
                    )}

                    {/* 備註 */}
                    <div className="space-y-2">
                      <Label>備註</Label>
                      <Textarea
                        placeholder="特殊說明或要求"
                        value={item.notes || ""}
                        onChange={(e) => updateItem(index, { notes: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 新增物品按鈕 - 只在最後一個物品後顯示 */}
                {isLastItem && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                      className="flex items-center gap-2 border-primary text-primary hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4" />
                      新增物品
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
