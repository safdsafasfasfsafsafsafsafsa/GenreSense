# GenreSense

Google AI Studio를 활용한 목업입니다. 분석 기능은 사용 가능합니다.

## 기존 환경의 문제점

Tunebat 등 음악의 메타데이터를 검색하는 사이트는 기존에도 존재했으나, 정작 음악의 장르에 대해서는 표기하지 않거나 있더라도 애매하고 포괄적인 경우가 많았음.

본 시스템은 장르 구분의 문제를 AI로 해결하는데 목적이 있음.

## 사용자

주로 음악 관련 종사자

## 아이디어, 핵심 기능

## 서비스 흐름

1. Analyze Audio에 파일을 업로드(직접 선택, 파일 드래그)

2. 태그 추가:

## AI 요소

구글 Gemini API를 활용

오디오 데이터 변환: 사용자가 업로드한 오디오 파일(MP3, WAV 등)을 클라이언트에서 Base64 형식의 문자열로 인코딩

멀티모달(Multimodal) 요청: 변환된 오디오 데이터와 함께, 장르 분석을 지시하는 텍스트 프롬프트를 Gemini 모델에 동시에 전송, 모델은 오디오를 직접 듣고 내용을 이해 가능

정교한 프롬프트 지시: AI에게 음악 장르 분류 전문가라고 역할을 부여하고, "상위 3개 장르를 확률과 함께 JSON 형식으로만 응답하세요."라고 매우 구체적으로 지시

JSON 스키마를 통한 출력 제어: Gemini API의 responseSchema 기능 -> AI가 반드시 정해진 JSON 구조({ "top3": [...] })에 맞춰 응답하도록 강제해 응답 데이터의 형식이 깨지는 것을 방지하고 안정적으로 결과를 파싱 가능

## 기술 스택

## 유료화 아이디어

## 기대 효과, 향후 계획

일반 사용자가 사용해도 좋지만, 주로 음악 관련 종사자가 빠르게 레퍼런스 노선을 잡는 용도로 사용되었으면 좋겠음.

음악 분석 관련 서비스가 대체로 웹으로만 작동하기 때문에, 차별화를 위해서 모바일 앱과 스피커를 통한 실시간 인식 기능이 추가되어야 할 것.

## 팀 정보

개인


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vT-aSQ2GS3fpcHfP0PzfZneb-l-aWk89

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
