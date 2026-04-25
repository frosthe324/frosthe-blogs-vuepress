import{_ as n,c as s,a,o as i}from"./app-BNbzGXAP.js";const l={};function r(c,e){return i(),s("div",null,e[0]||(e[0]=[a(`<p>本文索引:</p><ul><li><a href="#%E5%89%8D%E8%A8%80">前言</a></li><li><a href="#%E7%94%B3%E8%AF%B7%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6">申请通配符证书</a></li><li><a href="#%E6%9B%B4%E6%96%B0%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6">更新通配符证书</a></li><li><a href="#%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6">自动更新通配符证书</a></li><li><a href="#%E4%BD%BF%E7%94%A8-acmesh-%E6%9B%BF%E4%BB%A3-certbot-acme-%E5%AE%A2%E6%88%B7%E7%AB%AFtbd">使用 acme.sh 替代 certbot ACME 客户端(TBD)</a></li></ul><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h2><p>近期，<code>Let&#39;s Encrypt</code> 开放了通配符数字证书申请。通配符数字证书实现了单个证书绑定多个子域名。为了实现通配符证书，<code>Let’s Encrypt</code> 对 ACME 协议的实现进行了升级，只有 v2 协议才支持通配符证书。用户可自行查看客户代理软件是否支持 ACME v2 版本。官方主推的 <code>Certbot</code> 也需要升级到 0.22.0 版本之后才支持通配符证书。</p><p>通配符证书目前<strong>仅支持 <code>dns-01</code> 方式</strong>的 <code>Challenge</code>:</p><ul><li>dns-01: 申请人被要求将一串随机字符串以 <code>TXT</code> 记录添加至目标域名。</li></ul><p>不同的 DNS 提供商可能提供了对应的「插件」，可能需要单独安装，<code>certbot</code> 第三方 DNS 插件可在<a href="https://certbot.eff.org/docs/using.html?highlight=wildcard#third-party-plugins" target="_blank" rel="noopener noreferrer">此页面</a>查看。如果你注册的域名提供商(例如阿里云)没有提供官方的 DNS 插件，那么只能手动完成验证。</p><hr><h2 id="申请通配符证书" tabindex="-1"><a class="header-anchor" href="#申请通配符证书"><span>申请通配符证书</span></a></h2><p>以下以 <code>*.frosthe.net</code> 为例，使用 <code>manual</code> 插件回应 <code>Challenge</code>。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">$ certbot certonly -d *.frosthe.net --manual --preferred-chanllenge dns --server https://acme-v02.api.letsencrypt.org/directory</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>该命令表明:</p><ul><li>仅为 <code>*.frosthe.net</code> 获取通配符证书，无需安装</li><li>使用 <code>manual</code> 插件</li><li>使用 <code>dns</code> 方式回应 <code>Challenge</code></li><li>告知 <code>certbot</code> 采用 <code>Let&#39;s Encrypt</code> ACME v2 协议的 API 服务器</li></ul><p>接下来，命令行显示窗会询问申请人当前主机的 ip 地址将被记录，是否接收，输入 y:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">NOTE: The IP of this machine will be publicly logged as having requested this</span>
<span class="line">certificate. If you&#39;re running certbot in manual mode on a machine that is not</span>
<span class="line">your server, please ensure you&#39;re okay with that.</span>
<span class="line"></span>
<span class="line">Are you OK with your IP being logged?</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">(Y)es/(N)o: y</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下一步 <code>certbot</code> 将要求申请人手动添加一条 <code>TXT</code> 的解析:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Please deploy a DNS TXT record under the name</span>
<span class="line">_acme-challenge.frosthe.net with the following value:</span>
<span class="line"></span>
<span class="line">h9MFbboNRKqN4_8iDlu4dpIBd9UrXKqRrmP62ZHGhJ8</span>
<span class="line"></span>
<span class="line">Before continuing, verify the record is deployed.</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Press Enter to Continue</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，登录 <code>frosthe.net</code> 域名注册商的后台管理界面。确认无误后，回车，得到如下信息:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">IMPORTANT NOTES:</span>
<span class="line"> - Congratulations<span class="token operator">!</span> Your certificate and chain have been saved at:</span>
<span class="line">   /etc/letsencrypt/live/frosthe.net/fullchain.pem</span>
<span class="line">   Your key <span class="token function">file</span> has been saved at:</span>
<span class="line">   /etc/letsencrypt/live/frosthe.net/privkey.pem</span>
<span class="line">   Your cert will expire on <span class="token number">2019</span>-03-30. To obtain a new or tweaked</span>
<span class="line">   version of this certificate <span class="token keyword">in</span> the future, simply run certbot</span>
<span class="line">   again. To non-interactively renew *all* of your certificates, run</span>
<span class="line">   <span class="token string">&quot;certbot renew&quot;</span></span>
<span class="line"> - If you like Certbot, please consider supporting our work by:</span>
<span class="line"></span>
<span class="line">   Donating to ISRG / Let&#39;s Encrypt:   https://letsencrypt.org/donate</span>
<span class="line">   Donating to EFF:                    https://eff.org/donate-le</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>操作完成，可至对应的目录获取证书以作用后。</p><hr><h2 id="更新通配符证书" tabindex="-1"><a class="header-anchor" href="#更新通配符证书"><span>更新通配符证书</span></a></h2><p><code>certbot renew</code> 试图加载当前管理的所有证书的配置信息更新证书，<code>certbot renew</code> 更新阿里云托管的域名还存在一些问题没有解决。目前更新证书使用同样的 <code>certbot certonly</code> 子命令完成，必须手动完成 <code>challenge</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ certbot certonly <span class="token parameter variable">-d</span> *.frosthe.net <span class="token parameter variable">--manual</span> --preferred-challenge dns <span class="token parameter variable">--server</span> https://acme-v02.api.letsencrypt.org/directory</span>
<span class="line"></span>
<span class="line">Saving debug log to /var/log/letsencrypt/letsencrypt.log</span>
<span class="line">Plugins selected: Authenticator manual, Installer None</span>
<span class="line">Cert is due <span class="token keyword">for</span> renewal, auto-renewing<span class="token punctuation">..</span>.</span>
<span class="line">Renewing an existing certificate</span>
<span class="line">Performing the following challenges:</span>
<span class="line">dns-01 challenge <span class="token keyword">for</span> frosthe.net</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">NOTE: The IP of this machine will be publicly logged as having requested this</span>
<span class="line">certificate. If you<span class="token string">&#39;re running certbot in manual mode on a machine that is not</span>
<span class="line">your server, please ensure you&#39;</span>re okay with that.</span>
<span class="line"></span>
<span class="line">Are you OK with your IP being logged?</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line"><span class="token punctuation">(</span>Y<span class="token punctuation">)</span>es/<span class="token punctuation">(</span>N<span class="token punctuation">)</span>o: y</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Please deploy a DNS TXT record under the name</span>
<span class="line">_acme-challenge.frosthe.net with the following value:</span>
<span class="line"></span>
<span class="line">dhlr5daZbfwlgkjTSVHTPQXY2bWEr3VuBUHKegAofj4</span>
<span class="line"></span>
<span class="line">Before continuing, verify the record is deployed.</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Press Enter to Continue</span>
<span class="line">Waiting <span class="token keyword">for</span> verification<span class="token punctuation">..</span>.</span>
<span class="line">Cleaning up challenges</span>
<span class="line"></span>
<span class="line">IMPORTANT NOTES:</span>
<span class="line"> - Congratulations<span class="token operator">!</span> Your certificate and chain have been saved at:</span>
<span class="line">   /etc/letsencrypt/live/frosthe.net/fullchain.pem</span>
<span class="line">   Your key <span class="token function">file</span> has been saved at:</span>
<span class="line">   /etc/letsencrypt/live/frosthe.net/privkey.pem</span>
<span class="line">   Your cert will expire on <span class="token number">2019</span>-06-29. To obtain a new or tweaked</span>
<span class="line">   version of this certificate <span class="token keyword">in</span> the future, simply run certbot</span>
<span class="line">   again. To non-interactively renew *all* of your certificates, run</span>
<span class="line">   <span class="token string">&quot;certbot renew&quot;</span></span>
<span class="line"> - If you like Certbot, please consider supporting our work by:</span>
<span class="line"></span>
<span class="line">   Donating to ISRG / Let&#39;s Encrypt:   https://letsencrypt.org/donate</span>
<span class="line">   Donating to EFF:                    https://eff.org/donate-le</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="自动更新通配符证书" tabindex="-1"><a class="header-anchor" href="#自动更新通配符证书"><span>自动更新通配符证书</span></a></h2><p>由于通配符证书仅支持 dns 方式的验证，而这种方式要求申请人在其域名管理后台添加新的 <code>TXT</code> 记录，除了某些官方列出的域名提供商以外，其他域名托管商(例如阿里云)的申请人需要外挂脚本来自动化这一过程，参考 <a href="https://certbot.eff.org/docs/using.html?highlight=wildcard#pre-and-post-validation-hooks" target="_blank" rel="noopener noreferrer">Pre and Post Validation Hooks</a>。</p><h2 id="使用-acme-sh-替代-certbot-acme-客户端-tbd" tabindex="-1"><a class="header-anchor" href="#使用-acme-sh-替代-certbot-acme-客户端-tbd"><span>使用 acme.sh 替代 certbot ACME 客户端(TBD)</span></a></h2>`,28)]))}const d=n(l,[["render",r]]),p=JSON.parse(`{"path":"/posts/security/security-cert-wildcard-from-letsencrypt/","title":"向 Let's Encrypt CA 申请通配符证书","lang":"zh-CN","frontmatter":{"title":"向 Let's Encrypt CA 申请通配符证书","description":"申请通配符数字证书是 Let's Encrypt 近期推出的功能，只有支持 ACME v2 协议的客户代理软件才能申请通配符证书","excerpt":"申请通配符数字证书是 Let's Encrypt 近期推出的功能，只有支持 ACME v2 协议的客户代理软件才能申请通配符证书","author":"Frost He","date":"2018-07-24T00:00:00.000Z","lang":"zh-CN","category":["Cryptography"],"tag":["security","https"]},"git":{"updatedTime":1772897300000,"contributors":[{"name":"Frost He","username":"","email":"frosthe@qq.com","commits":4}],"changelog":[{"hash":"d7c833874cf63a93565de131aaea7abd35fb7629","time":1772897300000,"email":"frosthe@qq.com","author":"Frost He","message":"修复了一下 description"},{"hash":"9084b9be2b5259bd761dea3af5664f5e729d3efb","time":1772892199000,"email":"frosthe@qq.com","author":"Frost He","message":"修复了 build 错误"},{"hash":"ffa4807bd7d8fdbc3c457d61dcbe1be8e2744be4","time":1772706409000,"email":"frosthe@qq.com","author":"Frost He","message":"博客迁移初步完成"},{"hash":"a425f2611bfe3a002f92d9122c0c1114220b00ca","time":1768991112000,"email":"frosthe@qq.com","author":"Frost He","message":"migration WIP"}]},"filePathRelative":"posts/security/security-cert-wildcard-from-letsencrypt/index.md"}`);export{d as comp,p as data};
