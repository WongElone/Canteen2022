const collapsibles = document.querySelectorAll(".collapsible__toggler");
collapsibles.forEach((item) =>
  item.addEventListener("click", function () {
    this.closest(".collapsible").classList.toggle("collapsible--expanded");
  })
);