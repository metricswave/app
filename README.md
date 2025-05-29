# MetricsWave

**Real-time analytics for your product. Track every use-case of your business in real-time.**

MetricsWave is an open-source analytics platform that helps businesses track custom events, create beautiful dashboards, and gain insights into user behavior and business metrics in real-time.

## 🚀 Features

### 📊 **Custom Analytics Dashboards**
- Create unlimited custom dashboards with drag-and-drop widgets
- Real-time data visualization with charts, graphs, and metrics
- Public dashboard sharing capabilities
- Responsive design for mobile and desktop viewing
- Compare data across different time periods

### 📈 **Event Tracking & Triggers**
- Track custom events and user interactions
- Configure webhooks for external integrations
- Set up automated triggers based on specific conditions
- Monitor business-critical metrics and KPIs
- Historical data analysis and reporting

### 🔗 **Easy Integration**
- JavaScript tracking library for web applications
- Support for popular frameworks (React, Next.js, Svelte)
- WordPress plugin integration
- Google Tag Manager compatibility
- Webhook API for custom integrations

### 👥 **Team Collaboration**
- Multi-team support with role-based access
- Team member invitations and management
- Shared dashboards and reports
- Notification channels for important events

### 🛡️ **Privacy & Security**
- GDPR compliant data handling
- Secure data transmission and storage
- User consent management
- Data retention controls

## 🎯 Use Cases

### **E-commerce & SaaS**
- Track conversion funnels and customer journeys
- Monitor subscription metrics and churn rates
- Analyze product usage and feature adoption
- Measure marketing campaign effectiveness

### **Content & Media**
- Track content engagement and reading patterns
- Monitor video/audio consumption metrics
- Analyze user interaction with different content types
- Measure social sharing and virality

### **Mobile & Web Applications**
- Track user onboarding completion rates
- Monitor feature usage and app performance
- Analyze user retention and engagement
- Measure in-app purchase conversions

### **Marketing & Growth**
- Track lead generation and qualification
- Monitor email campaign performance
- Analyze website traffic and user behavior
- Measure A/B testing results

## 🛠️ Technical Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Charts:** Recharts, Nivo
- **State Management:** React Context + Custom Hooks
- **Routing:** React Router v6
- **Build Tool:** Create React App
- **Testing:** Jest + React Testing Library

## 📋 Prerequisites

Before running MetricsWave locally, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/metricswave.git
cd metricswave/app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure your environment variables:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_TRACKER_URL=your_tracker_endpoint
REACT_APP_SENTRY_DSN=your_sentry_dsn (optional)
```

### 4. Start Development Server

```bash
npm start
# or
yarn start
```

The application will open in your browser at `http://localhost:3000`.

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 📚 Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production
- **`npm run analyze`** - Analyzes the bundle size with source-map-explorer

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── form/           # Form inputs and controls
│   ├── icons/          # Icon components
│   └── ...
├── contexts/           # React context providers
├── helpers/            # Utility functions and helpers
├── layouts/            # Page layout components
├── pages/              # Main application pages
├── routes/             # Routing configuration
├── storage/            # State management and API calls
├── types/              # TypeScript type definitions
└── index.tsx           # Application entry point
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 **Reporting Bugs**

1. Check existing issues to avoid duplicates
2. Create a detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/environment details

### ✨ **Requesting Features**

1. Check existing feature requests
2. Create a detailed feature request with:
   - Use case description
   - Proposed solution
   - Alternative solutions considered
   - Implementation suggestions

### 💻 **Code Contributions**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
4. **Test your changes**
   ```bash
   npm test
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### 📝 **Code Style Guidelines**

- Use TypeScript for all new code
- Follow React functional component patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Write tests for new features

### 🧪 **Testing Guidelines**

- Write unit tests for utility functions
- Add integration tests for critical user flows
- Test components in isolation
- Ensure accessibility compliance
- Test responsive design on different screen sizes

## 📖 Documentation

For more detailed documentation, visit:

- [Official Documentation](https://metricswave.com/documentation)
- [API Reference](https://metricswave.com/docs/api)
- [Integration Guides](https://metricswave.com/documentation/integrations)

## 🐛 Troubleshooting

### Common Issues

**Build fails with memory errors:**
```bash
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

**TypeScript errors:**
```bash
npm run build --skip-ts-errors
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Recharts](https://recharts.org/) for beautiful data visualization
- All the amazing contributors who help improve MetricsWave

## 📞 Support

- **Community:** Join our discussions in GitHub Issues
- **Email:** For business inquiries: sales@metricswave.com
- **Documentation:** [metricswave.com/documentation](https://metricswave.com/documentation)

---

**Made with ❤️ by the MetricsWave community**
