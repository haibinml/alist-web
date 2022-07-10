import {
  Image,
  Center,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Checkbox,
} from "@hope-ui/solid";
import { createSignal } from "solid-js";
import { SwitchColorMode } from "~/components/SwitchColorMode";
import { SwitchLnaguage } from "~/components/SwitchLanguage";
import { useLoading } from "~/hooks/useLoading";
import { useT } from "~/hooks/useT";
import { useTitle } from "~/hooks/useTitle";
import { changeToken, r } from "~/utils/request";
import { Resp } from "~/types/resp";
import LoginBg from "./LoginBg";
import { notify } from "~/utils/notify";
import { useRouter } from "~/hooks/useRouter";
import { createStorageSignal } from "@solid-primitives/storage";

const Login = () => {
  const t = useT();
  useTitle(() => t("login.title"));
  const bgColor = useColorModeValue("#fff", "#18181c");
  const titleColor = useColorModeValue("#359eff", "#1890ff");
  const [username, setUsername] = createSignal(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = createSignal(
    localStorage.getItem("password") || ""
  );
  const [remember, setRemember] = createStorageSignal("remember-pwd", false);
  const { loading, data } = useLoading(() =>
    r.post("/auth/login", {
      username: username(),
      password: password(),
    })
  );
  const { searchParams, to } = useRouter();
  const Login = async () => {
    if (remember()) {
      localStorage.setItem("username", username());
      localStorage.setItem("password", password());
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
    const resp: Resp<{ token: string }> = await data();
    if (resp.code === 200) {
      notify.success(t("login.success"));
      changeToken(resp.data.token);
      to(decodeURIComponent(searchParams.redirect) || "/", true);
    } else {
      notify.error(t(resp.message));
    }
  };
  return (
    <Center zIndex="1" w="$full" h="$full">
      <VStack
        bgColor={bgColor()}
        rounded="$xl"
        p="24px"
        w={{
          "@initial": "90%",
          "@sm": "364px",
        }}
        spacing="$4"
      >
        <Flex alignItems="center" justifyContent="space-around">
          <Image
            boxSize="$12"
            src="https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg"
          />
          <Heading color={titleColor()} fontSize="$2xl">
            {t("login.title")}
          </Heading>
        </Flex>
        <Input
          placeholder={t("login.username-tip")}
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <Input
          placeholder={t("login.password-tip")}
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              Login();
            }
          }}
        />
        <Flex
          px="$1"
          w="$full"
          fontSize="$sm"
          color="$neutral10"
          justifyContent="space-between"
          alignItems="center"
        >
          <Checkbox
            checked={remember() || false}
            onChange={() => setRemember(!remember())}
          >
            {t("login.remember")}
          </Checkbox>
          <Text>{t("login.forget")}</Text>
        </Flex>
        <HStack w="$full" spacing="$2">
          <Button
            colorScheme="primary"
            w="$full"
            onClick={() => {
              setUsername("");
              setPassword("");
            }}
          >
            {t("login.clear")}
          </Button>
          <Button w="$full" loading={loading()} onClick={Login}>
            {t("login.login")}
          </Button>
        </HStack>
        <Button
          w="$full"
          colorScheme="accent"
          onClick={() => {
            changeToken("");
          }}
        >
          {t("login.use-guest")}
        </Button>
        <Flex
          mt="$2"
          justifyContent="space-evenly"
          alignItems="center"
          color="$neutral10"
          w="$full"
        >
          <SwitchLnaguage />
          <SwitchColorMode />
        </Flex>
      </VStack>
      <LoginBg />
    </Center>
  );
};

export default Login;
