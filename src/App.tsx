import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Activity, DollarSign, Users, Clock } from "lucide-react"

function App() {
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign },
    { title: "Active Users", value: "2,350", change: "+180.1%", icon: Users },
    { title: "Tasks Completed", value: "12,234", change: "+19%", icon: Activity },
    { title: "Avg. Response", value: "1.2s", change: "-4s", icon: Clock },
  ]

  const recentTasks = [
    { id: 1, name: "Data Pipeline Sync", status: "completed", progress: 100 },
    { id: 2, name: "ML Model Training", status: "running", progress: 67 },
    { id: 3, name: "Report Generation", status: "pending", progress: 0 },
    { id: 4, name: "Database Backup", status: "completed", progress: 100 },
  ]

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Execution Analytics</h1>
            <p className="text-muted-foreground mt-1">Monitor your system performance and tasks</p>
          </div>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>System execution metrics over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Chart placeholder</span>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Task completed successfully</p>
                        <p className="text-xs text-muted-foreground">{i * 5} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>Monitor running and pending executions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.name}</span>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'running' ? 'secondary' : 'outline'}>
                          {task.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Add your detailed charts and metrics here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
