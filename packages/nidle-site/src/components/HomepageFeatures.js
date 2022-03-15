import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '易用，轻量级',
    description: (
      <>
        Nidle是一款轻量级面向前端的基于node的自动化部署工具，安装简单，易于使用。
      </>
    ),
  },
  {
    title: '插件，可扩展',
    description: (
      <>
        Nidle可通过其插件架构进行扩展，插件通过熟悉的nodejs编写，从而可以自定义构建部署过程的任何步骤。
      </>
    ),
  },
  {
    title: '配置简单，可控',
    description: (
      <>
        Nidle预设了assets、h5、egg web基础模板，简单extend即可以实现基本的自动化部署流程，同时插件暴露的配置通过界面可以灵活设置。
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
