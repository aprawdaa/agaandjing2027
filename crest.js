/* The A & J monogram — initials only, used on the hero badge, gallery card and footer. */
const CREST = `<span class="mono-i">A</span><span class="mono-amp">&amp;</span><span class="mono-i">J</span>`;
document.querySelectorAll(".crest").forEach((el) => (el.innerHTML = CREST));
