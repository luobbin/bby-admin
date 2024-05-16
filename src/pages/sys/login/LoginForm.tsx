import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginReq } from '@/api/services/userService';
import { useLogin, useCaptcha } from '@/store/userStore';

function LoginForm() {
  // 加载语言包
  const { t } = useTranslation();
  // 颜色主题
  // const themeToken = useThemeToken();
  const [loading, setLoading] = useState(false);
  // 切换登录方式
  // const { loginState, setLoginState } = useLoginStateContext();
  // if (loginState !== LoginStateEnum.LOGIN) return null;
  // 验证码生成
  const [captchaImg, setCaptchaImg] = useState('');
  const [uuidStr, setUuid] = useState('');
  // 验证码获取并生成
  const getCaptcha = useCaptcha();
  useEffect(() => {
    const handleCaptcha2 = async () => {
      setLoading(true);
      try {
        await getCaptcha().then((res) => {
          // console.log('初始化', res);
          if (res !== undefined && res.img) {
            setCaptchaImg(res.img);
            // @ts-ignore
            setUuid(res.id);
          }
        });
      } finally {
        setLoading(false);
      }
    };
    handleCaptcha2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptcha = async () => {
    setLoading(true);
    try {
      const res = await getCaptcha();
      if (res !== undefined && res.img) {
        setCaptchaImg(res.img);
        // @ts-ignore
        setUuid(res.id);
      }
    } finally {
      setLoading(false);
    }
  };
  // 提交后进行登录数据发送
  const login = useLogin();
  const handleFinish = async ({ username, password, code, uuid, remember }: LoginReq) => {
    setLoading(true);
    uuid = uuidStr;
    console.log('uuid', uuid);
    try {
      await login({ username, password, code, uuid, remember });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signInFormTitle')}</div>
      <Form
        name="login"
        size="large"
        initialValues={{
          remember: true,
          username: '',
          password: '',
          code: '',
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: t('sys.login.accountPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.userName')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                name="code"
                rules={[{ required: true, message: t('sys.login.captchaPlaceholder') }]}
              >
                <Input placeholder={t('sys.login.captcha')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <img width={120} src={captchaImg} alt="点击替换验证码" onClick={handleCaptcha} />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('sys.login.rememberMe')}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} className="text-right">
              <button className="!underline">{t('sys.login.forgetPassword')}</button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t('sys.login.loginButton')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default LoginForm;
