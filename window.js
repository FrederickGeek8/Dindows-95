interact(".menubar").draggable({ onmove: dragMoveListener });
interact(".window").resizable({
  edges: { right: true, bottom: true, left: false, top: false }
}).on('resizemove', resizeMoveListener);

function dragMoveListener(event) {
  var target = event.target.parentNode,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
    y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function resizeMoveListener(event) {
  var target = event.target,
    x = parseFloat(target.getAttribute("data-x")) || 0,
    y = parseFloat(target.getAttribute("data-y")) || 0;

  // update the element's style
  target.style.width = event.rect.width + "px";
  target.style.height = event.rect.height + "px";

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

class WindowMananger {
  constructor() {
    this.windows = []
  }

  addTextWindow(title, text, icon, active=false) {
    let window = new TextWindow(title, text, icon, this);
    window.open();
    if (active) {
      this.deactiveAll();
      window.toggleActive();
      window.sendToFront();
    }
    this.windows.push(window);
  }

  becomeActive(target) {
    if (target.active == true) {
      return;
    }
    this.deactiveAll();
    target.toggleActive();
    target.sendToFront();
  }

  deactiveAll() {
    for (var i = 0; i < this.windows.length; i++) {
      this.windows[i].active = true;
      this.windows[i].toggleActive();
      this.windows[i].sendToBack();
    }
  }
}

class TextWindow {
  constructor(title, text, icon, manager) {
    this.manager = manager;
    this.active = false;
    this.thiswindow = document.createElement("div");
    this.thiswindow.className = "window";
    this.thiswindow.innerHTML = `<div class="menubar">
      <img src="${icon}" />
      <a>${title}</a>
      <div class="buttons">
        <div class="maximize"><img src="window-new.png" /></div><div class="close"><img src="window-close.png" /></div>
      </div>
    </div>
    <div class="body">
      <textarea>${text}</textarea>
    </div>`;
    this.taskbar = document.createElement("div");
    this.taskbar.className = "program";
    this.taskbar.innerHTML = `<img src="${icon}" /> ${title}`;
    this.thiswindow.getElementsByClassName("close")[0].onclick = _ => this.close();
    this.thiswindow.getElementsByClassName("maximize")[0].onclick = _ => this.maximize();
    this.thiswindow.onclick = _ => this.manager.becomeActive(this);
    this.taskbar.onclick = _ => this.manager.becomeActive(this);
  }

  open() {
    document.body.appendChild(this.thiswindow);
    document.getElementById("taskbar").appendChild(this.taskbar);
  }

  close(event=null) {
    document.body.removeChild(this.thiswindow);
    document.getElementById("taskbar").removeChild(this.taskbar);
  }

  sendToBack() {
    this.thiswindow.style.zIndex = 1;
  }

  sendToFront() {
    this.thiswindow.style.zIndex = 100;
  }

  maximize() {
    this.thiswindow.style.webkitTransform = this.thiswindow.style.transform = "translate(0px, 0px)";
    this.thiswindow.style.width = "100%";
    this.thiswindow.style.height = "calc(100% - 32px)";
    this.thiswindow.style.top = "0";
    this.thiswindow.style.left = "0";
  }
  
  toggleActive() {
    this.active = !this.active;
    if (this.active) {
      this.taskbar.className = "program active";
    } else {
      this.taskbar.className = "program";
    }
  }
}

var windowmanager = new WindowMananger();
var http = new XMLHttpRequest();
http.onreadystatechange = function() {
  if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
    windowmanager.addTextWindow("Hack the Planet CTF", http.responseText, "accessories-text-editor.png", true);
  }
}

http.open("GET", "intro.txt", true);
http.send();
