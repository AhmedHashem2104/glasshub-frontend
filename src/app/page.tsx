import { MantineProvider } from "@mantine/core";
import MultiStepForm from "../components/MultiStepForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <MantineProvider>
        <MultiStepForm />
      </MantineProvider>
    </div>
  );
}
