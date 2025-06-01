# Expense Tracker Frontend

A modern React-based frontend for the Expense Tracker application with responsive design and interactive charts.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Persistent login sessions

### 📊 Dashboard
- Overview of monthly expenses
- Quick stats (total spent, transactions, averages)
- Recent expenses list
- Category breakdown pie chart
- Quick access to add new expenses

### 💰 Expense Management
- Add, edit, and delete expenses
- Comprehensive filtering options (category, date range, amount range, text search)
- Pagination for large datasets
- Real-time validation

### 📈 Analytics
- Interactive charts using Recharts
- Monthly spending trends (Line chart)
- Category breakdown (Pie chart)
- Monthly comparison (Bar chart)
- Detailed category statistics
- Customizable date ranges

### 👤 Profile Management
- Update personal information
- Account statistics
- Security information

### 🎨 UI/UX Features
- Modern, clean design with custom CSS
- Fully responsive (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications
- Empty states with helpful messages

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Styling**: Custom CSS with CSS Variables

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - The frontend is configured to connect to `http://localhost:3000/api` by default
   - Update the API base URL in `src/services/api.js` if needed

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login, Register
│   ├── dashboard/      # Dashboard overview
│   ├── expenses/       # Expense list and form
│   ├── analytics/      # Charts and analytics
│   ├── profile/        # User profile
│   ├── layout/         # Navigation
│   └── common/         # Shared components
├── context/            # React Context
├── services/           # API calls
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Features in Detail

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically included in API requests
4. Auto-redirect on token expiration

### Expense Management
- **Add/Edit**: Form validation and error handling
- **Delete**: Confirmation dialogs
- **Filter**: Multiple filter options with real-time updates
- **Search**: Text search across expense titles
- **Pagination**: Efficient handling of large datasets

### Analytics Dashboard
- **Charts**: Interactive visualizations with Recharts
- **Statistics**: Comprehensive expense analytics
- **Date Ranges**: Customizable time periods
- **Categories**: Detailed breakdown by expense categories

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet**: Adapted layouts for medium screens
- **Desktop**: Full-featured experience
- **Navigation**: Collapsible mobile menu

## API Integration

The frontend communicates with the backend through a centralized API service that handles:
- Authentication (login, register, profile)
- Expense CRUD operations
- Statistics and analytics
- Error handling and token management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
