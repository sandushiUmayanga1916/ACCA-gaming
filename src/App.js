import Router from './Router'
import { ConfigProvider } from './Context/ConfigContext'
import { AuthProvider } from './Context/AuthContext'
import { QuizProvider } from './Context/QuizContext'

function App() {
	return (
		<ConfigProvider>
			<AuthProvider>
				<QuizProvider>
					<Router/>
				</QuizProvider>
			</AuthProvider>
		</ConfigProvider>
  );
}

export default App;
