export const checkNetwork = async (targetChainId) => {
    console.log("check")
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (currentChainId === targetChainId) {
      return true;
    } else {
      return false;
    }
  };
  
export const switchNetwork = async (targetChainId) => {
    console.log("switch")
    window.ethereum.request({
      method: "eth_switchEthereumChain",
      params: [{ chainId: targetChainId }],
    });
    
    // refresh webpage
    window.location.reload()
};

// module.exports = {
//     checkNetwork,
//     switchNetwork
// }