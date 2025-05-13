"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const LoremText = () => (
  <div className="space-y-4">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
    <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
    <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>
  </div>
)

export function ScrollbarPreview() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>Custom Scrollbar Styles</CardTitle>
        <CardDescription>Scrollbar styles that match your application design</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="default">
          <TabsList className="mb-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="with-shadows">With Shadows</TabsTrigger>
            <TabsTrigger value="hidden">Hidden</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-2">Standard Scrollbar</h3>
            <p className="text-sm text-muted-foreground mb-4">Default styled scrollbar with gradient colors.</p>
            <ScrollArea maxHeight="200px" className="rounded-md bg-slate-50 p-4">
              <LoremText />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="with-shadows" className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-2">Shadow Indicators</h3>
            <p className="text-sm text-muted-foreground mb-4">Scrollbar with top and bottom shadow indicators.</p>
            <ScrollArea maxHeight="200px" withShadows={true} className="rounded-md bg-slate-50 p-4">
              <LoremText />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="hidden" className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-2">Hidden Scrollbar</h3>
            <p className="text-sm text-muted-foreground mb-4">Content scrolls but scrollbar is hidden for cleaner UI.</p>
            <ScrollArea maxHeight="200px" hideScrollbar={true} className="rounded-md bg-slate-50 p-4">
              <LoremText />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 