"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submit-button";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [username, set_username] = useState("admin");
  const [password, set_password] = useState("admin@1234");
  const [loading, set_loading] = useState(false);

  const user_login = async () => {
    if (!username || !password) {
      toast({
        title: "Provide a username and password",
        variant: "destructive",
      });
      return;
    }

    try {
      set_loading(true);
      const loginResponse = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      set_loading(false);

      if (loginResponse.error) {
        toast({
          title: loginResponse.error,
          variant: "destructive",
        });
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      set_loading(false);
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="h-full flex items-center justify-center">
      <Card className="mx-autow-full md:w-auto md:min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>

          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>

          <CardDescription>
            Username: admin, password: admin@1234
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="john_doe"
                value={username}
                onChange={(e) => set_username(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <SubmitButton loading={loading} onClick={user_login}>
              Login
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
