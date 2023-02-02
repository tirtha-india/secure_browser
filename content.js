var endTest = false;

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    alert('Do not switch tabs or minimize the window during the test.');
  }
});

window.addEventListener('beforeunload', function(e) {
  if (!endTest) {
    e.preventDefault();
    e.returnValue = '';
  }
});

chrome.runtime.sendMessage({type: 'checkRequirements'}, function(response) {
  if (!response.internetStability) {
    alert('Please check your internet connection.');
  }
  if (!response.audio) {
    alert('Please allow microphone access.');
  }
  if (!response.camera) {
    alert('Please allow camera access.');
  }
});

document.querySelector('#end-test').addEventListener('click', function() {
  endTest = true;
  window.close();
});
