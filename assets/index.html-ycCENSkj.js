import{_ as e,c as n,a,o as i}from"./app-Cjg_akF9.js";const l="/assets/visualizer-OroUQyd_.png",c={};function d(r,s){return i(),n("div",null,s[0]||(s[0]=[a(`<p>参考资料:</p><ul><li><a href="https://docs.docker.com/get-started/part5/" target="_blank" rel="noopener noreferrer">Stacks</a></li></ul><h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h1><p>一个 <code>Stack</code> 是一组相互作用并共享依赖的 <code>service</code>，并且一起协同和伸缩的单元，一个 <code>Stack</code> 可以能够定义包含一个系统的所有功能。之前关于 <code>Service</code> 的介绍中已经用到了 <code>stack</code>，但那只是包含单个服务的 <code>stack</code>，在生产环境中 <code>stack</code> 往往许多服务，并将它们运行在不同的主机上。</p><h1 id="添加一个新的-service-并重新部署" tabindex="-1"><a class="header-anchor" href="#添加一个新的-service-并重新部署"><span>添加一个新的 service 并重新部署</span></a></h1><p>首先添加一个免费的可视化服务以监控 <code>swarm</code> 是如何调度 <code>container</code> 的。</p><ol><li>打开 docker-compose.yml，填充以下内容:</li></ol><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML"><pre><code class="language-YAML"><span class="line">version: &quot;3&quot;</span>
<span class="line">services:</span>
<span class="line">  web:</span>
<span class="line">    # replace username/repo:tag with your name and image details</span>
<span class="line">    image: username/repo:tag</span>
<span class="line">    deploy:</span>
<span class="line">      replicas: 5</span>
<span class="line">      restart_policy:</span>
<span class="line">        condition: on-failure</span>
<span class="line">      resources:</span>
<span class="line">        limits:</span>
<span class="line">          cpus: &quot;0.1&quot;</span>
<span class="line">          memory: 50M</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;80:80&quot;</span>
<span class="line">    networks:</span>
<span class="line">      - webnet</span>
<span class="line">  visualizer:</span>
<span class="line">    image: dockersamples/visualizer:stable</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;8080:8080&quot;</span>
<span class="line">    volumes:</span>
<span class="line">      - &quot;/var/run/docker.sock:/var/run/docker.sock&quot;</span>
<span class="line">    deploy:</span>
<span class="line">      placement:</span>
<span class="line">        constraints: [node.role == manager]</span>
<span class="line">    networks:</span>
<span class="line">      - webnet</span>
<span class="line">networks:</span>
<span class="line">  webnet:</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>web</code> 服务之后，添加了一个名为 <code>visualizer</code> 的服务，注意两项:</p><ul><li><code>volumns</code> 表示给予其访问 <code>docker</code> 主机的 <code>socket</code> 文件的权限。</li><li><code>placement</code> 确保该服务仅能在 <code>swarm manager</code> 上运行。</li></ul><ol start="2"><li>重新部署 stack</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">docker</span> stack deploy <span class="token parameter variable">-c</span> docker-compose.yml getstartedlab</span>
<span class="line"></span>
<span class="line">Updating <span class="token function">service</span> getstartedlab_web <span class="token punctuation">(</span>id: fmh8sn491klzx4vnz6uft0wc9<span class="token punctuation">)</span></span>
<span class="line">Creating <span class="token function">service</span> getstartedlab_visualizer</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+l+`" alt="Visualizer"> 从图上可以看出，<code>visualizer</code> 的单副本服务运行在了作为 <code>Swarm Manager</code> 的 <code>Aiur</code> 主机上。<code>Visualizer</code> 是一个可以包含在任何 <code>stack</code> 中单独运行的服务，它没有任何依赖。</p><h1 id="持久化数据" tabindex="-1"><a class="header-anchor" href="#持久化数据"><span>持久化数据</span></a></h1><p>现在，为 Stack 添加 Redis 数据库服务。</p><ol><li>在 docker-compose.yml 文件中新增服务声明:</li></ol><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML"><pre><code class="language-YAML"><span class="line">  redis:</span>
<span class="line">    image: redis</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;6379:6379&quot;</span>
<span class="line">    volumes:</span>
<span class="line">      - &quot;/home/pango/data:/data&quot;</span>
<span class="line">    deploy:</span>
<span class="line">      placement:</span>
<span class="line">        constraints: [node.role == manager]</span>
<span class="line">    command: redis-server --appendonly yes</span>
<span class="line">    networks:</span>
<span class="line">      - webnet</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Redis 官方提供了 Docker 的 image 并将其命名为 <code>redis</code>，所以没有 <code>username/repo</code> 的前缀，redis 的 container 预设端口为 6379，在 Compose 文件中同样以 6379 端口加以映射并对外界开放。在 redis 服务的声明中，有如下几点重要信息:</p><ul><li>redis 始终在 <code>swarm manager</code> 上运行，所以它总是使用相同的文件系统</li><li>redis 访问 <code>container</code> 中的 <code>/data</code> 目录来持久化数据，并映射到主机文件系统的 <code>/home/docker/data</code> 目录</li></ul><blockquote><p>如果不加以映射，那么 <code>redis</code> 仅将数据保存在 <code>container</code> 中的 <code>/data</code> 目录下，一旦该 <code>container</code> 被重新部署则数据就会被清除。</p></blockquote><ol start="2"><li>在 <code>Swarm Manager</code> 主机上创建 <code>/data</code> 目录:</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mkdir</span> ~/data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol start="3"><li>重新部署 stack:</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">docker</span> stack deploy <span class="token parameter variable">-c</span> docker-compose.yml getstartedlab</span>
<span class="line"></span>
<span class="line">Updating <span class="token function">service</span> getstartedlab_web <span class="token punctuation">(</span>id: fmh8sn491klzx4vnz6uft0wc9<span class="token punctuation">)</span></span>
<span class="line">Updating <span class="token function">service</span> getstartedlab_visualizer <span class="token punctuation">(</span>id: oj86dzaracmuoxb3ucvi7ro1e<span class="token punctuation">)</span></span>
<span class="line">Creating <span class="token function">service</span> getstartedlab_redis</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>执行 <code>docker service ls</code> 验证 3 个服务都已运行:</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">$ <span class="token function">docker</span> <span class="token function">service</span> <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line">ID                  NAME                       MODE                REPLICAS            IMAGE                             PORTS</span>
<span class="line">kuuocvu54rd1        getstartedlab_redis        replicated          <span class="token number">1</span>/1                 redis:latest                      *:6379-<span class="token operator">&gt;</span><span class="token number">6379</span>/tcp</span>
<span class="line">oj86dzaracmu        getstartedlab_visualizer   replicated          <span class="token number">1</span>/1                 dockersamples/visualizer:stable   *:8080-<span class="token operator">&gt;</span><span class="token number">8080</span>/tcp</span>
<span class="line">fmh8sn491klz        getstartedlab_web          replicated          <span class="token number">5</span>/5                 frosthe/get-started:part2         *:80-<span class="token operator">&gt;</span><span class="token number">80</span>/tcp</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在访问任意节点的 ip:8080，可以看到 <code>redis</code> 服务已经运行在 <code>Swarm Manager</code> 节点上。</p>`,27)]))}const t=e(c,[["render",d]]),p=JSON.parse('{"path":"/posts/containerization/docker-stacks/","title":"Docker 初探 (5) - Stacks","lang":"zh-CN","frontmatter":{"title":"Docker 初探 (5) - Stacks","date":"2018-02-01T23:09:17.000Z","description":"本文介绍了 Docker Stacks 的概念以及如何为 Stack 添加多个服务","categories":["Containerization"],"tag":["ops","docker"]},"git":{"updatedTime":1772880161000,"contributors":[{"name":"Frost He","username":"","email":"frosthe@qq.com","commits":2}],"changelog":[{"hash":"71cb34a04ffc8266e43e6eb3dead6684832c76ba","time":1772880161000,"email":"frosthe@qq.com","author":"Frost He","message":"修复了主页"},{"hash":"ffa4807bd7d8fdbc3c457d61dcbe1be8e2744be4","time":1772706409000,"email":"frosthe@qq.com","author":"Frost He","message":"博客迁移初步完成"}]},"filePathRelative":"posts/containerization/docker-stacks/index.md","excerpt":"<p>参考资料:</p>\\n<ul>\\n<li><a href=\\"https://docs.docker.com/get-started/part5/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Stacks</a></li>\\n</ul>\\n<h1>前言</h1>\\n<p>一个 <code>Stack</code> 是一组相互作用并共享依赖的 <code>service</code>，并且一起协同和伸缩的单元，一个 <code>Stack</code> 可以能够定义包含一个系统的所有功能。之前关于 <code>Service</code> 的介绍中已经用到了 <code>stack</code>，但那只是包含单个服务的 <code>stack</code>，在生产环境中 <code>stack</code> 往往许多服务，并将它们运行在不同的主机上。</p>"}');export{t as comp,p as data};
