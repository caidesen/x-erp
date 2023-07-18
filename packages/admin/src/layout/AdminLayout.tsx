import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProLayout,
} from "@ant-design/pro-components";
import { Link, Outlet, useLocation } from "react-router-dom";
import { trpc } from "@/shared";
import { routes } from "@/route";
import { Dropdown, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { RpcInput } from "@trpc-admin/server";
import { useRef } from "react";

type UpdatePasswordState = RpcInput["auth"]["updatePassword"] & {
  newPasswordAgain: string;
};

export function UpdatePasswordModal() {
  const formRef = useRef<ProFormInstance<UpdatePasswordState>>();
  const { mutateAsync: updatePassword } = trpc.auth.updatePassword.useMutation({
    onSuccess: () => {
      message.success("修改成功");
      setTimeout(() => {
        window.location.replace("logout");
      }, 1000);
    },
  });
  return (
    <ModalForm<UpdatePasswordState>
      formRef={formRef}
      title="修改密码"
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      trigger={<a>修改密码</a>}
      width="400px"
      onValuesChange={(changedValues, allValues) => {
        if (changedValues.newPassword && allValues.newPasswordAgain) {
          formRef.current!.validateFields(["newPasswordAgain"]);
        }
      }}
      onFinish={async (values) => {
        await updatePassword(values);
        return true;
      }}
    >
      <ProFormText.Password
        width="md"
        name="password"
        label="旧密码"
        placeholder="请输入旧密码"
        rules={[{ required: true, message: "请输入旧密码" }]}
      />
      <ProFormText.Password
        width="md"
        name="newPassword"
        label="新密码"
        placeholder="请输入新密码"
        rules={[
          { required: true, message: "请输入新密码" },
          { min: 6, message: "密码长度不能小于6位" },
          { max: 20, message: "密码长度不能大于20位" },
        ]}
      />
      <ProFormText.Password
        width="md"
        name="newPasswordAgain"
        label="确认新密码"
        placeholder="请再次输入新密码"
        rules={[
          { required: true, message: "请再次输入新密码" },
          {
            validator: async (rule, value) => {
              if (value !== formRef.current!.getFieldValue("newPassword")) {
                throw new Error("两次输入的密码不一致");
              }
            },
          },
        ]}
      />
    </ModalForm>
  );
}

export function Component(props: { children?: React.ReactNode }) {
  const location = useLocation();
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();
  return (
    <ProLayout
      location={location}
      layout="mix"
      splitMenus={true}
      fixSiderbar={true}
      title="小玩具"
      contentWidth="Fluid"
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        size: "small",
        title: userInfo?.nickname,
        onClick: (e) => {
          console.log(e);
        },
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "updatePassword",
                    icon: <LogoutOutlined />,
                    label: <UpdatePasswordModal />,
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "退出登录",
                    onClick: () => {
                      window.location.replace("/logout");
                    },
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      route={routes[0]}
      menuItemRender={(item, dom) => {
        return <Link to={item.path!}>{dom}</Link>;
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
