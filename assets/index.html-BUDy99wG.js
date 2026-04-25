import{_ as n,c as a,a as e,o as i}from"./app-vay8TtIL.js";const l={};function t(p,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h2 id="配置从外网访问-ha" tabindex="-1"><a class="header-anchor" href="#配置从外网访问-ha"><span>配置从外网访问 HA</span></a></h2><p>安装好 <strong>HA</strong> 之后，我们发现访问 Web UI 的 <code>url</code> 不需要任何用户认证，如果你打算将其暴露到互联网并通过外网访问自己的 <strong>HA</strong>，这等同于裸奔，任何互联网用户都能够控制你家的 <strong>HA</strong>。</p><h3 id="为-ha-网页-ui-设置密码" tabindex="-1"><a class="header-anchor" href="#为-ha-网页-ui-设置密码"><span>为 HA 网页 UI 设置密码</span></a></h3><p><strong>HA</strong> 支持为其设置访问密码的功能，可通过 http 节点下进行配置，首先在 <code>config</code> 文件夹下找到 <code>secrets.yaml</code>，编辑该文件:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">sudo</span> <span class="token function">nano</span> /etc/home-assistant/config/secrets.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Use this file to store secrets like usernames and passwords.</span></span>
<span class="line"><span class="token comment"># Learn more at https://home-assistant.io/docs/configuration/secrets/</span></span>
<span class="line">http_password: <span class="token punctuation">{</span>your_password_here<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，在 <code>configuration.yaml</code> 中的 <code>http</code> 节点下指定该项的引用:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">sudo</span> <span class="token function">nano</span> /etc/home-assistant/config/configuration.yaml</span>
<span class="line"></span>
<span class="line">http:</span>
<span class="line">  <span class="token comment"># Secrets are defined in the file secrets.yaml</span></span>
<span class="line">  api_password: <span class="token operator">!</span>secret http_password</span>
<span class="line">  ip_ban_enabled: <span class="token boolean">true</span></span>
<span class="line">  login_attempts_threshold: <span class="token number">5</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>ip_ban_enabled</code> 和 <code>login_attempts_threshold</code> 分别表示启用密码试错机制。然后重启 <strong>HA</strong> 服务:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">docker</span> container restart home-assistant</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="为-home-assistant-配置-nginx-代理" tabindex="-1"><a class="header-anchor" href="#为-home-assistant-配置-nginx-代理"><span>为 Home Assistant 配置 Nginx 代理</span></a></h3><p>将 Web UI 设置于 <code>Nginx</code> 之后有诸多好处，其中一项便是为其配置 <strong>Http SSL</strong>，关于 Nginx 的细节本文不赘述，此处假定 <code>ha.example.com</code> 为 Web UI 的虚拟主机名称:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">$ sudo nano /etc/nginx/sites-available/ha.example.com</span>
<span class="line"></span>
<span class="line">map $http_upgrade $connection_upgrade {</span>
<span class="line">    default upgrade;</span>
<span class="line">    &#39;&#39;      close;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">server {</span>
<span class="line">        listen 8123;</span>
<span class="line">        listen [::]:8123;</span>
<span class="line">        server_name ha.example.com;</span>
<span class="line"></span>
<span class="line">        location / {</span>
<span class="line">                proxy_set_header Host $host;</span>
<span class="line">                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">                proxy_http_version 1.1;</span>
<span class="line">                proxy_set_header Upgrade $http_upgrade;</span>
<span class="line">                proxy_set_header Connection $connection_upgrade;</span>
<span class="line">                proxy_pass http://localhost:8123;</span>
<span class="line">        }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>保存，创建该站点配置文件的符号链接，重启 <code>Nginx</code>:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">$ sudo cp -s /etc/nginx/sites-available/ha.example.com /etc/nginx/sites-enabled/ha.example.com</span>
<span class="line">$ sudo systemctl reload nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="为-homeassistant-应用-https" tabindex="-1"><a class="header-anchor" href="#为-homeassistant-应用-https"><span>为 HomeAssistant 应用 HTTPS</span></a></h3><p>即便使用了 API 密码，在不安全的通信连接中该信息仍然可能泄漏，要为站点应用 <strong>HTTPS</strong>，首先需要一个从世界知名 CA 获取的 <strong>SSL 数字证书</strong>，关于如何申请证书请参考「<a href="http://localhost:4000/security-cert-from-letsencrypt/" target="_blank" rel="noopener noreferrer">通过 Let&#39;s Encrypt 申请 SSL 数字证书</a>」。假设已经为 <code>ha.example.com</code> 申请了 <strong>SSL 数字证书</strong>，并且相关文件位于 <code>/etc/nginx/ssl/</code> 下，编辑站点的 <code>Nginx</code> 配置文件，具体参考「<a href="https://www.home-assistant.io/docs/ecosystem/nginx_subdomain/" target="_blank" rel="noopener noreferrer">NGINX with subdomain</a>」。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">server <span class="token punctuation">{</span></span>
<span class="line">    listen       <span class="token number">443</span> ssl<span class="token punctuation">;</span></span>
<span class="line">    server_name  ha.example.com<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    ssl on<span class="token punctuation">;</span></span>
<span class="line">    ssl_certificate /etc/nginx/ssl/ha.example.com/ha.example.com-bundle.crt<span class="token punctuation">;</span></span>
<span class="line">    ssl_certificate_key /etc/nginx/ssl/ha.example.com/ha.example.com.key<span class="token punctuation">;</span></span>
<span class="line">    ssl_prefer_server_ciphers on<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    location / <span class="token punctuation">{</span></span>
<span class="line">        proxy_pass http://localhost:8123<span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Host <span class="token variable">$host</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        proxy_http_version <span class="token number">1.1</span><span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Upgrade <span class="token variable">$http_upgrade</span><span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Connection <span class="token string">&quot;upgrade&quot;</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    location /api/websocket <span class="token punctuation">{</span></span>
<span class="line">        proxy_pass http://localhost:8123/api/websocket<span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Host <span class="token variable">$host</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        proxy_http_version <span class="token number">1.1</span><span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Upgrade <span class="token variable">$http_upgrade</span><span class="token punctuation">;</span></span>
<span class="line">        proxy_set_header Connection <span class="token string">&quot;upgrade&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17)]))}const o=n(l,[["render",t]]),r=JSON.parse('{"path":"/posts/smarthome/smarthome-enable-remote-access-to-ha/","title":"智慧家庭 - 外网远程访问家庭服务器中的 Home Assistant 实例","lang":"zh-CN","frontmatter":{"title":"智慧家庭 - 外网远程访问家庭服务器中的 Home Assistant 实例","description":"本文介绍了如何通过外网穿透实现远程访问家庭服务器的 HomeAssistant 实例，或其他 Web 服务","excerpt":"本文介绍了如何通过外网穿透实现远程访问家庭服务器的 HomeAssistant 实例，或其他 Web 服务","author":"Frost He","date":"2018-05-30T00:00:00.000Z","lang":"zh-CN","category":["Smart Home"],"tag":["linux","raspberry-pi","smart-home","home-assistant"],"reward_settings":[{"enable":true}]},"git":{"updatedTime":1772897300000,"contributors":[{"name":"Frost He","username":"","email":"frosthe@qq.com","commits":3}],"changelog":[{"hash":"d7c833874cf63a93565de131aaea7abd35fb7629","time":1772897300000,"email":"frosthe@qq.com","author":"Frost He","message":"修复了一下 description"},{"hash":"ffa4807bd7d8fdbc3c457d61dcbe1be8e2744be4","time":1772706409000,"email":"frosthe@qq.com","author":"Frost He","message":"博客迁移初步完成"},{"hash":"a425f2611bfe3a002f92d9122c0c1114220b00ca","time":1768991112000,"email":"frosthe@qq.com","author":"Frost He","message":"migration WIP"}]},"filePathRelative":"posts/smarthome/smarthome-enable-remote-access-to-ha/index.md"}');export{o as comp,r as data};
