let NUM_STARTING_CREATURES = 3;
let editMode = true;
let hiddenRow = document.getElementById("hiddenRow");
let initiativeTable = document.getElementById("initiativeTable");
numberCols();
for (let i = 0; i < NUM_STARTING_CREATURES; i++) { addCreature(); }
initiativeTable.addEventListener("click", onClickTable);
initiativeTable.addEventListener("keydown", onKeyDownTable);

function addCreature() {
  let row = hiddenRow.cloneNode(true);
  row.hidden = false;
  row.removeAttribute("id");
  row.setAttribute("row-type","creature");
  initiativeTable.tBodies[0].append(row);
  numberRows();
}

function numberRows() {
  numCreatures = 1;
  let rows = initiativeTable.rows;
  let row;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].getAttribute("row-type") == "creature") {
      row = rows[i];
      row.cells[0].textContent = numCreatures;
      numCreatures++;
      row.setAttribute("index", i);
      row.dataset.row_idx = i;
    }
  }
}

function numberCols() {
  for (let i = 0; i < initiativeTable.rows.length; i++) {
    for (let j = 0; j < initiativeTable.rows[i].cells.length; j++) {
      initiativeTable.rows[i].cells[j].dataset.col_idx = j;
    }
  }
}

function toggleEditMode() {
  let disable = editMode;
  editMode = !editMode;
  toggleEditModeByCssSelector(".input-creature-name", disable);
  toggleEditModeByCssSelector(".input-remove-creature", 
  disable);
  toggleEditModeByCssSelector(".input-init", disable);
  toggleEditModeByCssSelector(".input-damage-total", disable);
  toggleEditModeButton(editMode);
}

function toggleEditModeButton(editMode) {
  let button = document.getElementById("editModeButton")
  if (editMode) {
    button.value = "Turn off edit mode";
  } else {
    button.value = "Turn on edit mode";
  }
}

function toggleEditModeByCssSelector(css, disable) {
  let elements = initiativeTable.querySelectorAll(css);
  for (let elem of elements) {
    elem.disabled = disable;
  }
}

function reset() {
  while (initiativeTable.rows.length > 2) {
    deleteCreature(initiativeTable.rows[2]);
  }
  for (let i = 0; i < NUM_STARTING_CREATURES; i++) { 
    addCreature(); 
  }
}

function getInitValue(row) {
  return(row.cells[2].firstElementChild.value);
}

function sortCreatures() {
  let rows = Array.from(initiativeTable.tBodies[0].rows);

  rows.shift(); // helper row, keep at top
  activeRow = rows.shift(); // header row
  rows = rows.sort(function(r1, r2) { return getInitValue(r2) - getInitValue(r1) } );
  activeRow.after(...rows);

  numberRows();
}

function onClickTable(event) {
  
  let deleteCreatureButton = event.target.closest("input.input-remove-creature");
  
  if (deleteCreatureButton && initiativeTable.contains(deleteCreatureButton)) {

    let row = event.target.closest("tr");
    deleteCreature(row);

  }

  let addDamageButton = event.target.closest("input.input-damage-add");

  if (addDamageButton && initiativeTable.contains(addDamageButton)) {
    let row = event.target.closest("tr");
    addDamage(row);
  }

}

function deleteCreature(row) {
  row.remove();
  numberRows();  
}

function addDamage(row) {
  let incr_damage = row.querySelector(".input-damage-incr");
  let tot_damage = row.querySelector(".input-damage-total");
  let incr_damage_val = Number(incr_damage.value);
  if (incr_damage_val == 0 || incr_damage_val) {
    tot_damage.value = Number(tot_damage.value) + incr_damage_val;
    incr_damage.value = "";
  }
  
}

function onKeyDownTable(event) {

  if (event.code == "ArrowDown" || event.code == "ArrowUp") {
    let cell = event.target.closest("td");
    let row = event.target.closest("tr");
    if (!cell || !row) return;
    // alert(cell.firstElementChild.value);
    
    let rows = initiativeTable.tBodies[0].rows;
    let col_idx = cell.dataset.col_idx;
    // alert(row.dataset.row_idx);
    let row_idx = Number(row.dataset.row_idx) + (event.code == "ArrowDown" ? 1 : -1);
    // alert(row_idx);
    row_idx = Math.min(Math.max(2, row_idx), rows.length - 1);
    rows[row_idx].cells[col_idx].firstElementChild.focus();

  } else if ((event.code == "Enter" || event.code == "NumpadEnter") && event.target.closest(".input-damage-incr")) {
    addDamage(event.target.closest("tr"));
  }




}