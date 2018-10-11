// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    if (reg.installing) {
      console.log('Service worker is installing')
    } else if (reg.waiting) {
      console.log('Service worker is waiting')
    } else if (reg.active) {
      console.log('Service worker is active')
    }
  }).catch(function (error) {
    console.log('Register error:', error)
  })
}