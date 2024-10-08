import React,{useState,useEffect} from 'react'
import logo from '../logo.png'
import './App.css'
import { Web3 } from 'web3';
import daiAbi from '../abis/DaiToken.json'
const App = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [recipient, setRecipient] = useState(null)
  const [amount, setAmount] = useState(null)
const [daiContract,setDaiContract]=useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [transactions,setTransactions]=useState([])
  const web3 = new Web3(window.ethereum)

  const connectWallet = async () => {
    try {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            }).catch((err) => {
                if (err.code == 4001) {
                    console.log('Please connect to Metamask')
                } else {
                    console.log(err)
                }
            })
            setAccount(accounts[0])
            console.log('Connect to metammask account:', accounts[0])
            setIsConnected(true)


        } else {
            console.log('No web3 provider detected')
            setIsConnected(false)

        }
    } catch (err) {
        console.log(err)
        setIsConnected(false)
    }

}

const loadBlockchainData=async()=>{
  try{
    const accounts = await web3.eth.getAccounts();
    const daiTokenAddress="0xf8b1B170E6B49aEb5Ac68712cd8D72A5065F48f3"
    const daiContract = new web3.eth.Contract(daiAbi, daiTokenAddress)
    setDaiContract(daiContract)
    const balance=await daiContract.method.balanceOf(accounts[0]).call()
    console.log('Token balance>>>',web3.utils.fromWei(balance.toString(),'Ether'))
    setBalance(balance)
    const transaction=await daiContract.getPastEvents('Transfer',{fromBlock:0,toBlock:'latest'},{from:accounts[0]})


  }catch(err){
    console.log(err)
  }

}
const transfer=async(recipient, amount) =>{
  const accounts = await web3.eth.getAccounts();

  daiContract.methods.transfer(recipient, amount).send({ from: accounts[0]})
}


useEffect(()=>{
loadBlockchainData()
},[])
  return (
    <div>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Decrypt Wallet
      </a>
    </nav>
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex text-center">
          <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
        
            <h1>{balance} DAI</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <form onSubmit={(event) => {
              event.preventDefault()
              const recipient = recipient
              const amount = web3.utils.toWei(amount, 'Ether')
              transfer(recipient, amount)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="recipient"
                  type="text"
                  onChange={(e)=>setRecipient(e.target.value)}
                  className="form-control"
                  placeholder="Recipient Address"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="amount"
                  type="text"
                  onChange={(e)=>setAmount(e.target.value)}
                  className="form-control"
                  placeholder="Amount"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Send</button>
            </form>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Recipient</th>
                  <th scope="col">value</th>
                </tr>
              </thead>
              <tbody>
                { transactions.map((tx, key) => {
                  return (
                    <tr key={key} >
                      <td>{tx.returnValues.to}</td>
                      <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                    </tr>
                  )
                }) }
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  </div> )
}

export default App