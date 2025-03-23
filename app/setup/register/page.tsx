"use client";

import { Divider } from "@heroui/divider";
import RegisterForm from "@/components/auth/RegisterForm";
import { UserRegisterFormType } from "@/interfaces/User";
import { motion } from "framer-motion";
import useSetupUser from "@/hooks/api/setup/useSetupUser";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SetupRegisterPage() {
  const router = useRouter();

  const { mutateAsync: setupUser, isPending } = useSetupUser();

  const onRegister = async (data: UserRegisterFormType) => {
    const registerResponse = await setupUser(data);

    if (!registerResponse) {
      return;
    }

    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/setup/workspace");
      return;
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
        <div className="flex items-center gap-2">
          <Divider className="inline-block w-5" />
          <h3>Step 1</h3>
        </div>
        <h1 className="text-2xl mb-5">Create your first account</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <RegisterForm
          onRegister={onRegister}
          isLoading={isPending}
        />
      </motion.div>
    </div>
  );
}
