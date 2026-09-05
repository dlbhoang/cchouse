"use client";

import { Divider, Flex, Image, QRCode, Typography } from "antd";
import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const { Text } = Typography;

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="flex min-h-screen w-full bg-white">
      <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#071945] md:block">
        <img
          src="/assets/figma-visual.png"
          alt="C.C.House quản trị bất động sản"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
        />
      </section>

      <section className="flex min-h-screen w-full flex-col bg-white px-5 py-6 sm:px-10 md:w-[47%] md:max-w-[676px] md:px-[7.5%] md:py-8">
        <header className="flex shrink-0 items-start justify-between gap-6">
          <Image
            src="/logo_with_slogan.jpg"
            alt="C.C.HOUSE"
            preview={false}
            width={238}
            height={80}
            className="shrink-0 object-contain object-left"
          />
          <Text className="max-w-[286px] pt-5 text-right text-sm leading-5 text-slate-500">
            © Copyright @ 2027 C.C.House. All rights reserved - Since 2015
          </Text>
        </header>

        <div className="mx-auto w-full max-w-[528px] flex-1 pt-14 md:pt-16">
          {mode === "login" && (
            <div className="mb-8">
              <Text className="text-base text-slate-500">Xin chào bạn</Text>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Đăng nhập để tiếp tục</h2>
            </div>
          )}

          <LoginForm isVisible={mode === "login"} onModeChange={() => setMode("register")} />
          <RegisterForm isVisible={mode === "register"} onModeChange={() => setMode("login")} />

          {mode === "login" && (
            <>
              <Divider className="my-8" />
              <Flex align="center" justify="center" gap={18}>
                <QRCode
                  size={90}
                  errorLevel="Q"
                  value={process.env.NEXT_PUBLIC_LOGIN?.toString() ?? "https://admin.cchouse.vn"}
                  icon="/logo.png"
                  iconSize={18}
                />
                <Text className="text-sm text-slate-700">Quét mã QR để truy cập</Text>
              </Flex>
            </>
          )}
        </div>

        <footer className="mx-auto mt-8 w-full max-w-[528px] border-t border-slate-100 pt-7">
          <Text className="text-sm font-bold tracking-wide text-slate-900">MỌI CHI TIẾT LIÊN HỆ</Text>
          <Flex vertical gap={3} className="mt-4">
            <Text className="text-sm text-slate-700">0917 07 17 19 - 0919 70 74 77</Text>
            <Text className="text-sm text-slate-700">Email: info@cchouse.vn</Text>
            <Text className="text-sm text-slate-700">Mã số thuế: 0313463662</Text>
          </Flex>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;