<script setup>
import '@/assets/css/home/info-section.css'

// on scroll
window.onscroll = function () {
  scrollFunction()
}

// Function to fade in the info-section paragraphs
function scrollFunction() {
  // Calculate the percentage of the info-section that has been scrolled
  const infoSection = document.querySelector('.info-section')
  const infoSectionHeight = infoSection.offsetHeight
  const infoSectionScroll = window.pageYOffset - infoSection.offsetTop + 400
  let infoSectionScrollPercentage = (infoSectionScroll / infoSectionHeight) * 100 * 2
  if (infoSectionScrollPercentage > 100) {
    infoSectionScrollPercentage = 100
  } else if (infoSectionScrollPercentage < 0) {
    infoSectionScrollPercentage = 0
  }

  // Fade in the info-section paragraphs
  const infoSectionParagraphs = document.querySelectorAll('.info-section-paragraph')
  for (let i = 0; i < infoSectionParagraphs.length; i++) {
    if (infoSectionScrollPercentage > 100 - i * 20) {
      infoSectionParagraphs[i].style.opacity = 1
    } else {
      infoSectionParagraphs[i].style.opacity = 0
    }

    infoSectionParagraphs[i].style.opacity =
      (infoSectionScrollPercentage * (infoSectionParagraphs.length - i)) / 100
  }
}
</script>

<template>
  <div class="info-section">
    <div class="info-section-content">
      <h1 class="info-section-title">Hvorfor er det viktig å redusere matavfall?</h1>
      <div class="info-section-paragraph">
        <h2>Klimaendringer</h2>
        <p>
          Matproduksjon er en av de største kildene til klimagassutslipp. Når mat blir kastet, blir
          all energien som ble brukt til å produsere maten, også bortkastet. Dette fører til
          unødvendig utslipp av klimagasser, som igjen bidrar til klimaendringer og global
          oppvarming.
        </p>
      </div>
      <img class="info-section-image" src="@/assets/img/svg/environment.svg" alt="Miljø" />
      <div class="info-section-paragraph">
        <h2>Ressursbruk</h2>
        <p>
          Produksjon av mat krever store mengder ressurser som land, vann og energi. Når mat blir
          kastet, går disse ressursene tapt, og det blir vanskeligere å produsere nok mat for en
          voksende verdensbefolkning.
        </p>
      </div>
      <div class="info-section-paragraph">
        <h2>Økonomisk kostnad</h2>
        <p>
          Matsvinn er også dyrt. Når mat blir kastet, går også pengene som ble brukt på å produsere,
          transportere og lagre maten tapt. Dette kan føre til økt matpris og redusert
          tilgjengelighet for personer med begrensede økonomiske ressurser.
        </p>
      </div>
      <img class="info-section-image" src="@/assets/img/svg/savings.svg" alt="Sparing" />
      <div class="info-section-paragraph">
        <h2>Sult og underernæring</h2>
        <p>
          Det er over 800 millioner mennesker i verden som lider av sult og underernæring. Ved å
          redusere matsvinnet kan man bidra til å øke tilgangen til mat for disse menneskene.
        </p>
      </div>
      <div class="info-section-paragraph">
        <h2>Etisk ansvar</h2>
        <p>
          Å kaste mat er et etisk problem, spesielt når det er så mange mennesker som lider av sult.
          Å unngå matsvinn kan være et tegn på ansvarlighet og medfølelse.
        </p>
      </div>
      <img class="info-section-image" src="@/assets/img/svg/thought.svg" alt="Medfølelse" />
    </div>
  </div>
</template>
