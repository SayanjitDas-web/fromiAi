import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import promtStructure from "./promt";
import { Sparkles } from "lucide-react";

function App() {
  const [promt, setPromt] = useState("");
  const [genResult, setResult] = useState([]); // Set to an empty array
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoding] = useState(false);

  const generate = async () => {
    setIsLoding(true);
    const genAI = new GoogleGenerativeAI(
      import.meta.env.GEMINI_API
    );

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(promtStructure(promt));
      const response = result.response;

      // Ensure `response.text()` returns an array of objects
      const parsedResult = JSON.parse(
        response.text().replace("```javascript", "").replace("```", "")
      );

      setResult(parsedResult); // Ensure the result is an array of form elements
      setIsLoding(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-col justify-center items-center">
      <h1 className="text-center text-6xl mb-2">Formi</h1>
      <p className="text-center text-xl mb-10">
        build forms faster using ai 🔥.{" "}
      </p>
      <div className="flex justify-center items-center py-2">
        <div className="flex justify-center items-center w-[350px]">
          <Input
            type="text"
            placeholder="enter to build form.."
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
            className="mr-2"
          ></Input>
          <Button onClick={() => generate()} className="">
            generate <Sparkles fill="white" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <form className="w-[350px]">
          {genResult.length > 0
            ? genResult.map((field) => {
                switch (field.component) {
                  case "input":
                    return (
                      <div
                        className="grid w-full max-w-sm items-center gap-1.5 m-4"
                        key={field.label}
                      >
                        <Label htmlFor={field.label}>{field.label}</Label>
                        <Input
                          type={field.type}
                          id={field.type}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      </div>
                    );
                  case "textarea":
                    return (
                      <div
                        className="grid w-full max-w-sm items-center gap-1.5 m-4"
                        key={field.label}
                      >
                        <Label htmlFor={field.label}>{field.label}</Label>
                        <Textarea
                          placeholder={field.placeholder}
                          id={field.label}
                          required={field.required}
                        />
                      </div>
                    );
                  case "select":
                    return (
                      <div
                        key={field.label}
                        className="grid w-full max-w-sm items-center gap-1.5 m-4"
                      >
                        <Label htmlFor={field.label}>{field.label}</Label>
                        <Select required={field.required} id={field.label}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{field.label}</SelectLabel>
                              {field.options.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  case "datepicker":
                    return (
                      <div
                        key={field.label}
                        className="grid w-full max-w-sm items-center gap-1.5 m-4"
                      >
                        <Label htmlFor={field.label}>{field.label}</Label>
                        <Popover id={field.label}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              <span>{field.placeholder}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  default:
                    return null;
                }
              })
            : ""}
          {isLoading ? (
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
