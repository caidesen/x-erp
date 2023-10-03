import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Tabs } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { LoginInput } from "@nest-admin/server";

type LoginType = "phone" | "account";

export function Component() {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const navigate = useNavigate();

  const { mutateAsync: doLoginByLocal } = useMutation({
    mutationFn: api.auth.loginByLocal,
    onSuccess() {
      message.success("登录成功！");
      navigate("/");
    },
  });
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <LoginFormPage<LoginInput>
        title="小玩具"
        backgroundImageUrl="/login-bg.jpg"
        onFinish={(val) => {
          return doLoginByLocal(val);
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名:"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码:"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
        </div>
      </LoginFormPage>
    </div>
  );
}
