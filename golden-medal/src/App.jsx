import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

const availableNames = ["الأسد", "النمر", "الصقر", "الفهد", "النسر"];

const apiKey = "https://jsonblob.com/api/jsonBlob/1367823886456119296"; // أدخل مفتاح JSON Blob هنا

function Login({ onLogin, onRegister, setApiKey }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiInput, setApiInput] = useState("");

  const handleSubmit = () => {
    if (isRegistering) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  };

  const handleApiSet = () => {
    setApiKey(apiInput);
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
      <CardContent>
        <h1 className="text-2xl font-bold text-center mb-4">مسابقة الوسام الذهبي</h1>
        <Input placeholder="مفتاح JSON Blob" value={apiInput} onChange={e => setApiInput(e.target.value)} />
        <Button className="w-full mt-2" onClick={handleApiSet}>تأكيد المفتاح</Button>

        <div className="space-y-4 mt-4">
          <Input placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
          <Input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleSubmit}>{isRegistering ? "إنشاء حساب" : "تسجيل الدخول"}</Button>
          <p className="text-sm text-center">
            {isRegistering ? "لديك حساب؟" : "ليس لديك حساب؟"}
            <span className="text-blue-500 cursor-pointer ml-1" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "سجل الدخول" : "أنشئ حساب"}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NameSelection({ onConfirm, claimedNames }) {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div className="space-y-4">
      <p className="text-center">اختر اسماً فريداً للمسابقة:</p>
      <div className="grid grid-cols-2 gap-2">
        {availableNames.map(name => (
          <Button
            key={name}
            disabled={claimedNames.includes(name)}
            variant={selectedName === name ? "default" : "outline"}
            onClick={() => setSelectedName(name)}
          >
            {name}
          </Button>
        ))}
      </div>
      {selectedName && !claimedNames.includes(selectedName) && (
        <Button className="w-full mt-2" onClick={() => onConfirm(selectedName)}>تأكيد الاسم</Button>
      )}
    </div>
  );
}

function WeeklySchedule({ name }) {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">مرحباً، {name} 👋</h2>
      <p>هنا جدول الأسبوع. (سيتم تطوير الجدول لاحقاً)</p>
    </div>
  );
}

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmedName, setConfirmedName] = useState(null);
  const [claimedNames, setClaimedNames] = useState([]);
  const [apiKeyState, setApiKeyState] = useState("");
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "golden123") {
      setIsLoggedIn(true);
      setConfirmedName("المشرف");
      navigate("/schedule");
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (username, password) => {
    setIsLoggedIn(true);
  };

  const confirmName = (name) => {
    setConfirmedName(name);
    setClaimedNames([...claimedNames, name]);
    navigate("/schedule");
  };

  if (!isLoggedIn || !apiKeyState) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} setApiKey={setApiKeyState} />;
  }

  if (!confirmedName || confirmedName === "المشرف") {
    return <NameSelection onConfirm={confirmName} claimedNames={claimedNames} />;
  }

  return <WeeklySchedule name={confirmedName} />;
}

export default function GoldenMedalApp() {
  return (
    <Router>
      <motion.div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
        <Routes>
          <Route path="/*" element={<AppWrapper />} />
        </Routes>
      </motion.div>
    </Router>
  );
}
