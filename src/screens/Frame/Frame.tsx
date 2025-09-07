import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";

interface FrameProps {
  setIsAuthenticated: (value: boolean) => void;
}

export const Frame = ({ setIsAuthenticated }: FrameProps): JSX.Element => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: Add actual authentication logic here
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <div className="bg-[#F7F8FA] flex flex-row justify-center w-full min-h-screen">
      <div className="w-full max-w-[1440px] py-[100px] flex justify-center">
        <Card className="bg-white rounded-[10px] p-[60px] w-[500px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]">
          <CardContent className="flex flex-col items-center gap-[60px] p-0">
            {/* Logo */}
            <div className="flex items-center justify-center gap-[13.74px] py-[9.16px]">
              <img
                className="w-[63.7px] h-[61px]"
                alt="SMEase Logo"
                src="/image-1.png"
              />
              <div className="[font-family:'ABC_Diatype-Bold',Helvetica] font-bold text-black text-[30.5px] tracking-[-0.61px]">
                SMEase
              </div>
            </div>

            <div className="flex flex-col items-center gap-[34px] w-full">
              {/* Heading */}
              <div className="flex flex-col items-center gap-[21px] w-full">
                <h1 className="[font-family:'ABC_Diatype-Bold',Helvetica] font-bold text-black text-[40px] text-center tracking-[-0.80px] leading-[44px]">
                  {isLogin ? "Login Now" : "Create Account"}
                </h1>
                <p className="text-[#00000099] text-base text-center">
                  {isLogin ? "Welcome back! Please enter your details." : "Create your account to get started."}
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col items-start justify-center gap-10 w-full">
                {/* Input Fields */}
                <div className="flex flex-col w-full items-start gap-[16.44px]">
                  {/* Email Field */}
                  <div className="flex flex-col w-full gap-[9.07px]">
                    <label className="[font-family:'ABC_Diatype-Medium',Helvetica] font-medium text-black text-base tracking-[-0.32px]">
                      Email address
                    </label>
                    <Input
                      className="h-[42px] rounded-[5.14px] border-[1.03px] border-[#e6e6e6] bg-white placeholder:text-[#00000099]"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col w-full gap-[9.07px]">
                    <label className="[font-family:'ABC_Diatype-Medium',Helvetica] font-medium text-black text-base tracking-[-0.32px]">
                      Password
                    </label>
                    <div className="relative w-full">
                      <Input
                        type="password"
                        className="h-[42px] rounded-[5.14px] border-[1.03px] border-[#e6e6e6] pr-10 bg-white placeholder:text-[#00000099]"
                        placeholder={isLogin ? "Enter your password" : "Create a password"}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[21px] h-5 cursor-pointer">
                        <div className="relative w-[17px] h-[13px] top-[3px] left-0.5">
                          <div className="relative h-[13px]">
                            <img
                              className="absolute w-[7px] h-[7px] top-[3px] left-[5px]"
                              alt="Fill"
                              src="/fill-1.svg"
                            />
                            <img
                              className="absolute w-[17px] h-[13px] top-0 left-0"
                              alt="Eye icon"
                              src="/group-5.png"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remember Password - Only show on login */}
                  {isLogin && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-[11.09px]">
                        <Checkbox
                          id="remember"
                          className="w-[23.19px] h-[23.19px] rounded-[5px] border-[1.01px] border-[#878888] opacity-40"
                        />
                        <label
                          htmlFor="remember"
                          className="[font-family:'ABC_Diatype-Regular',Helvetica] font-normal text-[#878888] text-sm tracking-[-0.28px] leading-[14.1px]"
                        >
                          Remember password
                        </label>
                      </div>
                      <button className="[font-family:'ABC_Diatype-Medium',Helvetica] font-medium text-[#335cff] text-sm">
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Buttons and Links */}
                <div className="flex flex-col w-full items-center gap-[16.13px]">
                  <Button 
                    onClick={handleSubmit}
                    className="w-full h-[46px] bg-[#335cff] rounded-[5.14px] shadow-[0px_8.06px_25.2px_#725dff1a] [font-family:'ABC_Diatype-Bold',Helvetica] font-bold text-white text-base hover:bg-[#2a4ad8] transition-colors"
                  >
                    {isLogin ? "Login" : "Create New Account"}
                  </Button>

                  <div className="[font-family:'ABC_Diatype-Regular',Helvetica] font-normal text-sm">
                    <span className="text-[#00000099]">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="[font-family:'ABC_Diatype-Medium',Helvetica] font-medium text-[#335cff] text-base hover:text-[#2a4ad8] transition-colors"
                    >
                      {isLogin ? "Register now" : "Login now"}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center w-full gap-[10px]">
                  <Separator className="flex-1 bg-[#e6e6e6]" />
                  <span className="[font-family:'ABC_Diatype-Regular',Helvetica] font-normal text-[#00000099] text-sm">
                    Or
                  </span>
                  <Separator className="flex-1 bg-[#e6e6e6]" />
                </div>

                {/* Google Login */}
                <Button
                  variant="outline"
                  className="w-full h-[49px] rounded-[5.14px] border-[1.03px] border-[#e6e6e6] flex justify-center items-center hover:bg-[#f5f5f5] transition-colors"
                >
                  <div className="flex items-center gap-[16.13px]">
                    <img
                      className="w-[20.16px] h-[20.16px] object-cover"
                      alt="Google logo"
                      src="/google-g.png"
                    />
                    <span className="[font-family:'ABC_Diatype-Regular',Helvetica] font-normal text-black text-sm tracking-[-0.28px]">
                      {isLogin ? "Log in" : "Sign up"} with google
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
