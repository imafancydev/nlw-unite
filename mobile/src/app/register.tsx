import { useState } from "react";
import { View, Image, StatusBar, Alert } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import axios from "axios";

import { colors } from "@/styles/colors";

import { api } from "@/server/api";
import { useBadgeStore } from "@/store/badge-store";

import { Input } from "@/components/input";
import { Button } from "@/components/button";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert("Inscrição", "Preencha todos os campos");
      }

      setIsLoading(true);

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (registerResponse.data.attendeeId) {
        const badgeResponde = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`,
        );

        badgeStore.save(badgeResponde.data.badge);

        Alert.alert("Inscrição", "Inscrição realizada com sucesso", [
          {
            text: "Ok",
            onPress: () => {
              router.push("/ticket");
            },
          },
        ]);
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        if (String(err.response?.data.massage).includes("already registered")) {
          return Alert.alert("Inscrição", "Email já registrado");
        }
      }

      Alert.alert("Inscrição", "Não foi possivel fazer a inscrição");
    }
  }
  return (
    <View className="flex-1 justify-center items-center p-8 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />
      <View className="gap-3 mt-12 w-full">
        <Input>
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field placeholder="Nome completo" onChangeText={setName} />
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Button
          title="Realizar Inscrição"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <Link
          href="/"
          className="mt-8 text-base font-bold text-center text-gray-100"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  );
}
