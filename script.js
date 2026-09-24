const RELEASES_API = "https://api.github.com/repos/vhxLUA-max/cheezie-releases/releases?per_page=8";
const LATEST_API = "https://api.github.com/repos/vhxLUA-max/cheezie-releases/releases/latest";
const DOWNLOAD_URL = "https://github.com/vhxLUA-max/cheezie-releases/releases/latest/download/Cheezie.exe";

const releaseStatus = document.getElementById("releaseStatus");
const versionBadge = document.getElementById("versionBadge");
const versionDetails = document.getElementById("versionDetails");
const releaseGrid = document.getElementById("releaseGrid");

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
function cleanVersion(tag){
  return tag ? (tag.startsWith("v") ? tag : `v${tag}`) : "Latest";
}
function formatDate(value){
  if(!value) return "";
  return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(new Date(value));
}
function formatBytes(bytes){
  if(!Number.isFinite(bytes) || bytes <= 0) return "";
  const units=["B","KB","MB","GB"];
  let size=bytes, unit=0;
  while(size>=1024 && unit<units.length-1){ size/=1024; unit++; }
  return `${size.toFixed(unit ? 1 : 0)} ${units[unit]}`;
}
function excerpt(text){
  if(!text) return "Official Cheezie release.";
  const clean=String(text).replace(/[#*_\`>]/g,"").replace(/\r?\n+/g," ").trim();
  return clean.length>125 ? clean.slice(0,122)+"…" : clean;
}
function findExeAsset(release){
  return (release.assets||[]).find(a=>/\.exe$/i.test(a.name) && /cheezie/i.test(a.name))
    || (release.assets||[]).find(a=>/\.exe$/i.test(a.name));
}
function findExe(release){
  const asset=findExeAsset(release);
  return asset?.browser_download_url
    || `https://github.com/vhxLUA-max/cheezie-releases/releases/download/${encodeURIComponent(release.tag_name)}/Cheezie.exe`;
}
function releaseCard(release,index){
  const version=cleanVersion(release.tag_name);
  const date=formatDate(release.published_at || release.created_at);
  const asset=findExeAsset(release);
  const size=formatBytes(asset?.size);
  const downloads=Number.isFinite(asset?.download_count) ? asset.download_count : 0;
  const isLatest=index===0;
  const prerelease=release.prerelease;
  const meta=[date, size, downloads ? `${downloads.toLocaleString()} downloads` : ""].filter(Boolean).join(" · ");
  return `<article class="release-card ${isLatest ? "is-latest":""}">
    <div class="release-card-top">
      <div class="release-version">${escapeHtml(version)}</div>
      <div class="release-badges">${isLatest ? '<span class="release-badge latest">LATEST</span>':""}${prerelease ? '<span class="release-badge preview">PREVIEW</span>':""}</div>
    </div>
    <div class="release-date">${escapeHtml(meta || "Published release")}</div>
    <p>${escapeHtml(excerpt(release.body))}</p>
    <div class="release-card-bottom">
      <span class="release-file">WINDOWS · EXE</span>
      <a class="release-download" href="${escapeHtml(findExe(release))}" download>Download <span>↗</span></a>
    </div>
  </article>`;
}
function setReleaseState({version="Latest",details="Latest release",ready=false}){
  if(releaseStatus) releaseStatus.textContent=ready ? `${version} available` : details;
  if(versionBadge) versionBadge.textContent=version;
  if(versionDetails) versionDetails.textContent=details;
}
async function loadLatest(){
  try{
    const response=await fetch(LATEST_API,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
    if(!response.ok) throw new Error();
    const release=await response.json();
    setReleaseState({
      version:cleanVersion(release.tag_name),
      details:`Published ${formatDate(release.published_at)}`,
      ready:true
    });
  }catch{
    setReleaseState({details:"Release information will appear here when a build is published.",ready:false});
  }
}
async function loadReleases(){
  if(!releaseGrid) return;
  try{
    const response=await fetch(RELEASES_API,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
    if(!response.ok) throw new Error();
    const releases=await response.json();
    const published=releases.filter(release=>!release.draft);
    releaseGrid.innerHTML=published.length
      ? published.map(releaseCard).join("")
      : '<div class="release-empty"><strong>No published releases yet.</strong><span>Once a Cheezie release is published, it will appear here automatically.</span></div>';
  }catch{
    releaseGrid.innerHTML='<div class="release-empty"><strong>Releases are temporarily unavailable.</strong><span>The main download still points to the latest published Cheezie build.</span></div>';
  }
}
document.querySelectorAll('a[href*="cheezie-releases/releases/latest/download/Cheezie.exe"]').forEach(link=>{
  link.href=DOWNLOAD_URL;
  link.addEventListener("click",()=>{
    link.setAttribute("aria-busy","true");
    setTimeout(()=>link.removeAttribute("aria-busy"),1200);
  });
});
loadLatest();
loadReleases();
