"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { InputText } from "@/components/InputText";
import { loginApi } from "@/lib/api/auth";
import { useAuth } from "@/stores/auth";
import { useState } from "react";
import { toast } from "react-toastify";

type User = {
  email: string;
  password: string;
};

const EMPTY_FORM: User = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState<User>({ ...EMPTY_FORM });

  const setToken = useAuth((store) => store.setToken);

  async function login(event: React.SubmitEvent) {
    event.preventDefault();

    try {
      const token = await loginApi(form);
      setToken(token);
    } catch (error) {
      console.error(error);
      toast.error("Error login in");
    }
  }

  return (
    <div className="max-w-96 mb-auto mx-auto">
      <Card>
        <form className="flex flex-col gap-3" onSubmit={login}>
          <InputText
            label="Email"
            type="email"
            state={form.email}
            setState={(newValue) => setForm({ ...form, email: newValue })}
          ></InputText>
          <InputText
            label="Password"
            type="password"
            state={form.password}
            setState={(newValue) => setForm({ ...form, password: newValue })}
          ></InputText>

          <div className="flex">
            <Button className="ml-auto">Login</Button>
          </div>
        </form>
      </Card>

      <Card className="mt-4">
        <p>Guest User: test@test.com</p>
        <p>Guest Password: 123</p>
      </Card>
    </div>
  );
}
