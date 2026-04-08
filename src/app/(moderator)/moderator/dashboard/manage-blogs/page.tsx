import { motion } from "framer-motion";
import { PageLayout, SectionHeading, AnimatedCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Edit, Trash2, Plus, Send, Eye, Tag,
  MessageSquare, AlertCircle, Ticket, Percent, Calendar, 
  Search, Filter, LayoutGrid, List, MoreVertical
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery } from "@/hooks/useApiQuery";
import { deleteBlog } from "@/services/blog.services";
import { toast } from "sonner";

// --- MOCK DATA ---


const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Draft: "bg-muted text-muted-foreground border-border",
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

// --- SUB-COMPONENTS ---

const BlogManagerSection = ({blogs}) => (
  <AnimatedCard delay={0.1} className="mb-8 overflow-hidden border-none bg-card/50 backdrop-blur-md">
    <Tabs defaultValue="manage" className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Blog Studio</h3>
            <p className="text-xs text-muted-foreground">Draft, schedule, and analyze your content</p>
          </div>
        </div>
        
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="manage" className="gap-2"><List className="h-4 w-4" /> Management</TabsTrigger>
          <TabsTrigger value="listing" className="gap-2"><LayoutGrid className="h-4 w-4" /> Listing View</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="manage" className="mt-0">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pub">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Create Post</Button>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Article Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground line-clamp-1">{blog.title}</span>
                      <span className="text-xs text-muted-foreground">Updated {blog.date}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="font-normal">{blog.category}</Badge></TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[blog.status]} border font-medium`}>{blog.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" /> {blog.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4 text-primary" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="listing" className="mt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="group relative flex flex-col rounded-2xl border border-border/50 bg-background/50 p-4 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-video mb-4 rounded-xl bg-muted/50 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                 <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-md border-none">{blog.category}</Badge>
              </div>
              <h4 className="font-bold text-foreground mb-2 line-clamp-2">{blog.title}</h4>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{blog.date}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2">Preview</Button>
                  <Button size="sm" className="h-7 text-xs px-2">Edit</Button>
                </div>
              </div>
            </div>
          ))}
          {/* Create New Post Shortcut */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 p-6 transition-colors hover:border-primary/50 hover:bg-primary/5">
            <div className="mb-2 p-3 rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">Add New Article</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </AnimatedCard>
);

// --- MAIN DASHBOARD ---

const ManagerDashboard = () => {

  const url = `/blog?pagge=${page}&limit=${limit}&status=${status}`
 
   const {data,isLoading} = useApiQuery(["fetch-blogs"],"/blog","axios");

   const blogs = data?.data.data
 

   // Define your blog model
// model Blog {
//   id              String    @id @default(uuid())
//   title           String
//   slug            String    @unique
//   thumbnail            String?    
//   excerpt         String?   @db.Text
//   fullContent     String    @db.VarChar(10000) 
//   seoTags         Json?    
//   category        String?
//   comments Comment[]
//   status          BlogStatus @default(DRAFT)
//   createdAt       DateTime  @default(now())
//   updatedAt       DateTime  @updatedAt
//   publishedAt     DateTime?
//   authorId        String
//   author          Manager      @relation(fields: [authorId], references: [id])

//   @@index([slug])
//   @@index([authorId])
// }

const handleDelete = async(id) =>{
    const result = await deleteBlog(id);
       if(result.success){
        toast.success(result.message)
       }else{
        toast.error(result.message)
       }
}
const handleView = async(id) =>{
    
}


   return(
  
    <PageLayout>
    <section className="py-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading 
          badge="Workspace" 
          title="Management Center" 
          subtitle="Oversee content, address technical issues, and manage promotions." 
        />

        {/* 1. Blog Studio Section */}
        <BlogManagerSection blogs={blogs} />

     
      </div>
    </section>
    </PageLayout>
 )
}

export default ManagerDashboard;