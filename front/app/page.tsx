import Main from "./components/main"
import Provider from "./components/state"

export default function Home() {
  return (
    <Provider>
      <Main />
    </Provider>
  )
}
