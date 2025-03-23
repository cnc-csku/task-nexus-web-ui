"use client";

import { motion } from "framer-motion";
import { UserRegisterFormType } from "@/interfaces/User";
import RegisterForm from "@/components/auth/RegisterForm";
import axios from "@/lib/axios/axios.config";
import { getApiErrorMessage } from "@/utils/errutils";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onRegister = async (data: UserRegisterFormType) => {
    setIsLoading(true);
    try {
      const registerResponse = await axios.post("auth/v1/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (registerResponse.status === 200) {
        toast.success("Registration successful");
      }

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.ok) {
        router.push("/workspaces");
        return;
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-[500px]">
      <motion.div
        className="flex flex-col gap-5 px-1"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-2xl mb-5">Register</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <RegisterForm
          onRegister={onRegister}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
