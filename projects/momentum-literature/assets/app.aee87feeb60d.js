(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var search = document.querySelector("[data-paper-search]");
  var role = document.querySelector("[data-paper-role]");
  var applicability = document.querySelector("[data-paper-applicability]");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-paper-item]"));
  var resultCount = document.querySelector("[data-result-count]");

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("ko-KR").trim();
  }

  function updateFilters() {
    if (!items.length) return;
    var query = normalize(search && search.value);
    var roleValue = role ? role.value : "";
    var applicabilityValue = applicability ? applicability.value : "";
    var visible = 0;

    items.forEach(function (item) {
      var matches = (!query || normalize(item.dataset.search).indexOf(query) !== -1) &&
        (!roleValue || item.dataset.role === roleValue) &&
        (!applicabilityValue || item.dataset.applicability === applicabilityValue);
      item.hidden = !matches;
      if (matches) visible += 1;
    });

    if (resultCount) resultCount.textContent = String(visible) + "편 표시 중";
  }

  [search, role, applicability].forEach(function (control) {
    if (control) control.addEventListener(control === search ? "input" : "change", updateFilters);
  });

  var compareData = document.getElementById("compare-data");
  var compareForm = document.querySelector("[data-compare-form]");
  var compareHead = document.querySelector("[data-compare-head]");
  var compareBody = document.querySelector("[data-compare-body]");

  if (compareData && compareForm && compareHead && compareBody) {
    var parsed;
    var compareStatus = document.createElement("p");
    compareStatus.className = "notice";
    compareStatus.setAttribute("role", "status");
    compareStatus.hidden = true;
    compareForm.insertAdjacentElement("afterend", compareStatus);
    try {
      parsed = JSON.parse(compareData.textContent);
    } catch (_error) {
      parsed = null;
    }

    function renderCompareError(message) {
      compareStatus.textContent = message;
      compareStatus.hidden = false;
      compareHead.replaceChildren();
      compareBody.replaceChildren();
      var heading = document.createElement("th");
      heading.scope = "col";
      heading.textContent = "비교 상태";
      compareHead.appendChild(heading);
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      cell.textContent = message;
      row.appendChild(cell);
      compareBody.appendChild(row);
    }

    function renderCompare() {
      if (!parsed || !Array.isArray(parsed.works) || !Array.isArray(parsed.rows)) return;
      var requestedIds = Array.prototype.slice.call(compareForm.querySelectorAll("select"))
        .map(function (select) { return select.value; })
        .filter(Boolean);
      var uniqueIds = requestedIds.filter(function (value, index, all) {
        return all.indexOf(value) === index;
      });
      if (uniqueIds.length < 2 || uniqueIds.length !== requestedIds.length) {
        renderCompareError(uniqueIds.length < 2
          ? "서로 다른 논문을 최소 2편 선택하세요."
          : "같은 논문을 두 번 선택할 수 없습니다.");
        return;
      }
      compareStatus.hidden = true;
      var selected = uniqueIds
        .map(function (id) {
          return parsed.works.find(function (work) { return work.id === id; });
        })
        .filter(Boolean);
      if (selected.length < 2) {
        renderCompareError("선택한 논문을 찾을 수 없습니다.");
        return;
      }

      compareHead.replaceChildren();
      var labelHead = document.createElement("th");
      labelHead.scope = "col";
      labelHead.textContent = "비교 항목";
      compareHead.appendChild(labelHead);
      selected.forEach(function (work) {
        var th = document.createElement("th");
        th.scope = "col";
        var link = document.createElement("a");
        link.href = work.url;
        link.textContent = work.id + " · " + work.title;
        th.appendChild(link);
        compareHead.appendChild(th);
      });

      compareBody.replaceChildren();
      parsed.rows.forEach(function (row) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.scope = "row";
        th.textContent = row.label;
        tr.appendChild(th);
        selected.forEach(function (work) {
          var td = document.createElement("td");
          td.textContent = work.values[row.key] || "미확인";
          tr.appendChild(td);
        });
        compareBody.appendChild(tr);
      });

      var params = new URLSearchParams();
      selected.forEach(function (work) { params.append("id", work.id); });
      history.replaceState(null, "", "?" + params.toString());
    }

    var requested = new URLSearchParams(location.search).getAll("id");
    if (requested.length) {
      Array.prototype.slice.call(compareForm.querySelectorAll("select")).forEach(function (select, index) {
        if (requested[index] && parsed.works.some(function (work) { return work.id === requested[index]; })) {
          select.value = requested[index];
        }
      });
      renderCompare();
    }

    compareForm.addEventListener("change", renderCompare);
    compareForm.addEventListener("submit", function (event) {
      event.preventDefault();
      renderCompare();
    });
  }
}());
