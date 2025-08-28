
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Upload, FileText, Check } from "lucide-react";
import ReportIllustration from "@/assets/illustrations/ReportIllustration";
import { useNavigate } from "react-router-dom";
import { createReport } from "@/redux/actions/reportAction";

const formSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  patientEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  reportDescription: z.string().min(5, {
    message: "Please provide at least a brief description.",
  }),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to share your medical data.",
  }),
});

const SubmitReport = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId") || "";
  const requestId = searchParams.get("requestId") || "";
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      reportDescription: "",
      consent: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast.error("Please upload at least one report file");
      return;
    }
    if (files.length > 5) {
      toast.error("Please upload at least 5 report file");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    // setTimeout(() => {
    //   console.log({
    //     ...values,
    //     files,
    //     doctorId,
    //     requestId
    //   });

    // set all data in formData
    const formData = new FormData();
    formData.append("reportName" , values.patientName);
    formData.append("reportEmail" , values.patientEmail);
    formData.append("description" , values.reportDescription);
    formData.append("doctorId" , doctorId);
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });


    const result = await createReport({ formData,toast });
    console.log(result , "resultresult")
    if(!result.message){
      return setIsSubmitted(false);
    }else{
      // create link
      const link = document.createElement("a");
      link.href = result?.message?.sessionUrl;
      link.click();
    }
      setIsSubmitting(false);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Submission Successful!</CardTitle>
            <CardDescription>
              Your medical report has been successfully submitted. The healthcare provider will review it shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={handleReturnHome}>Return Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 bg-slate-50">
      <div className="hidden md:flex md:w-1/2 justify-center p-6">
        <ReportIllustration className="w-full max-w-md" />
      </div>
      
      <div className="w-full md:w-1/2 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#062D46]">Submit Medical Report</CardTitle>
            <CardDescription>
              Upload your medical reports securely to share with your healthcare provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="patientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reportDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe the report (e.g., blood test results, x-ray, etc.)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <Label htmlFor="file-upload">Upload Reports</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Supported formats: PDF, JPEG, PNG, DICOM
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <Label>Selected Files</Label>
                      <div className="space-y-2 mt-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-100 rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#062D46]" />
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I consent to share my medical data with my healthcare provider
                        </FormLabel>
                        <FormDescription>
                          Your data is encrypted and securely stored according to HIPAA regulations.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit and Pay"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitReport;
