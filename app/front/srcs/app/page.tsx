import Main from "./components/main"
import Provider from "./state"

export default function Home() {
  return (
    <Provider>
      <Main />
    </Provider>
  )
}
