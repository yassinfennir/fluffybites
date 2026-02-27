(function(){
'use strict';

var root=document.documentElement;

function qs(s){return document.querySelector(s)}
function qsa(s){return document.querySelectorAll(s)}

function navScroll(){
  var navbar=qs('#navbar');
  if(!navbar)return;
  if(window.scrollY>80)navbar.classList.add('solid');
  else navbar.classList.remove('solid');
}

function navActive(){
  var sections=['hero','menu','gallery','contact','location'];
  var links=qsa('.navbar__link[data-section]');
  var scrollY=window.scrollY+100;
  var active='hero';
  sections.forEach(function(id){
    var el=document.getElementById(id);
    if(el&&el.offsetTop<=scrollY)active=id;
  });
  links.forEach(function(a){
    var h=a.getAttribute('href')||'';
    if(h.indexOf('#'+active)===0)a.classList.add('active');
    else a.classList.remove('active');
  });
}

function hamburger(){
  var toggle=qs('#navToggle');
  var menu=qs('#navMenu');
  if(!toggle||!menu)return;
  function close(){
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    menu.classList.remove('open');
  }
  toggle.addEventListener('click',function(){
    var isOpen=menu.classList.contains('open');
    if(isOpen){close();return}
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    menu.classList.add('open');
  });
  menu.querySelectorAll('.navbar__link').forEach(function(a){
    a.addEventListener('click',close);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')close();
  });
  document.addEventListener('click',function(e){
    if(menu.classList.contains('open')&&!menu.contains(e.target)&&!toggle.contains(e.target))close();
  });
}

function menuTabs(){
  var tabs=qsa('.menu__tab');
  var panels=qsa('.menu__panel');
  if(!tabs.length||!panels.length)return;
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var id='panel-'+tab.dataset.tab;
      tabs.forEach(function(t){t.classList.remove('active')});
      panels.forEach(function(p){p.classList.remove('active')});
      tab.classList.add('active');
      var panel=document.getElementById(id);
      if(panel)panel.classList.add('active');
    });
  });
}

function galleryLightbox(){
  var items=qsa('.gallery__item');
  var lightbox=qs('#lightbox');
  var content=qs('.lightbox__content');
  var closeBtn=qs('.lightbox__close');
  var prevBtn=qs('.lightbox__prev');
  var nextBtn=qs('.lightbox__next');
  if(!items.length||!lightbox)return;
  var idx=0;
  function show(i){
    idx=(i+items.length)%items.length;
    var el=items[idx];
    var placeholder=el.querySelector('.gallery__placeholder');
    content.innerHTML='';
    if(placeholder){
      var clone=placeholder.cloneNode(true);
      clone.style.width='auto';
      clone.style.maxWidth='90vw';
      clone.style.height='auto';
      clone.style.maxHeight='90vh';
      content.appendChild(clone);
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }
  function hide(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  }
  items.forEach(function(item,i){
    item.addEventListener('click',function(){show(i)});
  });
  if(closeBtn)closeBtn.addEventListener('click',hide);
  if(prevBtn)prevBtn.addEventListener('click',function(){show(idx-1)});
  if(nextBtn)nextBtn.addEventListener('click',function(){show(idx+1)});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')hide();
    if(e.key==='ArrowLeft')show(idx-1);
    if(e.key==='ArrowRight')show(idx+1);
  });
}

function contactForm(){
  var form=qs('#contactForm');
  var success=qs('#formSuccess');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.querySelector('[name="name"]').value.trim();
    var email=form.querySelector('[name="email"]').value.trim();
    var msg=form.querySelector('[name="message"]').value.trim();
    if(!name){form.querySelector('[name="name"]').focus();return}
    var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){form.querySelector('[name="email"]').focus();return}
    if(!msg){form.querySelector('[name="message"]').focus();return}
    form.reset();
    if(success){
      success.textContent='✅ Message sent!';
      success.removeAttribute('hidden');
      setTimeout(function(){success.setAttribute('hidden','')},3000);
    }
  });
}

function smoothLinks(){
  qsa('a[href^="#"]').forEach(function(a){
    var id=a.getAttribute('href');
    if(id==='#')return;
    a.addEventListener('click',function(e){
      var t=document.querySelector(id);
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
    });
  });
}

function init(){
  navScroll();
  navActive();
  hamburger();
  menuTabs();
  galleryLightbox();
  contactForm();
  smoothLinks();
  window.addEventListener('scroll',function(){
    navScroll();
    navActive();
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
