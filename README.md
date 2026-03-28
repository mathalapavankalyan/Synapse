# OmniBridge: Intent-to-Action ⚡️

**OmniBridge** is a universal, Gemini-powered intent-to-action engine designed for societal benefit. It acts as a bridge between unstructured, "messy" real-world data and structured, life-saving protocols.

## 🌟 The Vision
In emergency situations, information is often chaotic—a frantic voice call, a shaky video of a disaster, a blurry photo of a medical report, or a wall of unstructured text. OmniBridge uses the power of Gemini AI to instantly parse this chaos and convert it into a verified, structured action plan.

## 🚀 Key Features
- **Multimodal Input Support**: Seamlessly process Text, Images, Audio, and Video.
- **Intelligent Categorization**: Automatically identifies the domain (Medical, Disaster, Safety, Logistics) and assigns an urgency level (Critical to Low).
- **Structured Data Extraction**: Converts "messy" inputs into clean, actionable parameters (e.g., extracting vital signs from a medical record or coordinates from a disaster report).
- **Life-Saving Protocols**: Generates a step-by-step immediate action plan based on the analyzed intent.
- **Verified Resources**: Suggests official resources, contacts, and links relevant to the situation.
- **Privacy-First Design**: Built with a focus on secure, real-time processing.

## 🛠 Tech Stack
- **Frontend**: React 19, Tailwind CSS 4, Lucide Icons, Motion (for fluid animations).
- **Backend**: Express.js (serving as a robust static host and API proxy).
- **AI Engine**: Google Gemini 3 series via the `@google/genai` SDK.
- **Deployment**: Optimized for Google Cloud Run.

## 📦 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mathalapavankalyan/prompt-for-build.git
   cd prompt-for-build
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## ☁️ Deployment to Google Cloud

This application is production-ready for **Google Cloud Run**.

### Option 1: AI Studio (Recommended)
1. Click the **"Deploy"** button in the AI Studio interface.
2. Select **"Deploy to Cloud Run"**.
3. Follow the prompts to authorize and launch.

### Option 2: Manual Deployment
1. Ensure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed.
2. Run the following command:
   ```bash
   gcloud run deploy omnibridge --source . --allow-unauthenticated
   ```

## 📄 License
This project is licensed under the Apache-2.0 License.

---
*Built for societal benefit using Google Gemini AI.*
