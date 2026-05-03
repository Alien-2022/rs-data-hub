# 首批 20 个遥感数据集清单

> 整理时间：2026-03-27 | 链接已全部验证 | 数据已录入 Supabase

## 数据集一览

| # | 名称 | 任务 | 模态 | 图像数 | 存储 | 机构 | 年份 | 论文 | 下载 |
|---|------|------|------|--------|------|------|------|------|------|
| 1 | NWPU-RESISC45 | 图像分类 | 光学 | 31,500 | 2.5GB | 西北工大 | 2017 | [arxiv](https://arxiv.org/abs/1703.00121) | [ModelScope](https://www.modelscope.cn/datasets/timm/resisc45) |
| 2 | DOTA v2.0 | 目标检测 | 光学 | 11,268 | 50GB | 武汉大学 | 2021 | [arxiv](https://arxiv.org/abs/2102.12219) | [官网](https://captain-whu.github.io/DOTA/dataset.html) |
| 3 | DIOR | 目标检测 | 光学 | 23,463 | 15GB | 西北工大 | 2020 | [arxiv](https://arxiv.org/abs/1909.00133) | [官网](https://gcheng-nwpu.github.io/) |
| 4 | AID | 图像分类 | 光学 | 10,000 | 3GB | 武汉大学 | 2017 | [arxiv](https://arxiv.org/abs/1608.05167) | [官网](https://captain-whu.github.io/AID/) |
| 5 | EuroSAT | 图像分类 | 多光谱 | 27,000 | 1.8GB | 海德堡大学 | 2019 | [IEEE](https://ieeexplore.ieee.org/document/8736719) | [GitHub](https://github.com/phelber/EuroSAT) |
| 6 | BigEarthNet | 图像分类 | 多光谱 | 549,488 | 1TB | 柏林工大 | 2024 | [arxiv](https://arxiv.org/abs/2407.03653) | [官网](https://bigearth.net/) |
| 7 | UAVid | 语义分割 | 多光谱 | 150 | 5GB | 代尔夫特理工 | 2020 | [arxiv](https://arxiv.org/abs/1810.10438) | [OpenDataLab](https://opendatalab.com/OpenDataLab/UAVid) |
| 8 | OpenEarthMap | 语义分割 | 光学 | 8,000+ | 50GB | 东京大学 | 2024 | [arxiv](https://arxiv.org/abs/2404.12803) | [官网](https://open-earth-map.org/) |
| 9 | iSAID | 实例分割 | 光学 | 2,806 | 10GB | 武汉大学 | 2019 | [arxiv](https://arxiv.org/abs/1904.00369) | [官网](https://captain-whu.github.io/iSAID/) |
| 10 | Potsdam | 语义分割 | 光学 | 384 | 10GB | ISPRS | 2014 | — | [ModelScope](https://modelscope.cn/datasets/OpenDataLab/ISPRS_Potsdam) |
| 11 | Vaihingen | 语义分割 | 光学 | 33 | 2GB | ISPRS | 2014 | — | [ISPRS](https://www.isprs.org/resources/datasets/benchmarks/UrbanSemLab/) |
| 12 | MLRSNet | 图像分类 | 光学 | 109,161 | 30GB | 西北工大 | 2020 | [arxiv](https://arxiv.org/abs/2010.00243) | [NODA](https://noda.ac.cn/datasharing/datasetDetails/67ad4a11a9b76819350a5f2b) |
| 13 | MAR20 | 目标检测 | 光学 | 3,400+ | 2GB | 西北工大 | 2022 | [遥感学报](https://www.ygxb.ac.cn/en/article/doi/10.11834/jrs.20222139/) | [官网](https://gcheng-nwpu.github.io/#Datasets) |
| 14 | FAIR1M | 目标检测 | 光学 | 42,796 | 100GB | 北航 | 2021 | [arxiv](https://arxiv.org/abs/2103.05569) | [NODA](https://www.noda.ac.cn/datasharing/datasetDetails/666fe818d67b985a5113eb26) |
| 15 | VDD | 语义分割 | 多光谱 | 10,000+ | 20GB | 香港理工 | 2023 | [arxiv](https://arxiv.org/abs/2305.13608) | [HuggingFace](https://huggingface.co/datasets/RussRobin/VDD) |
| 16 | UDD | 语义分割 | 多光谱 | 5,000+ | 10GB | ETH Zurich | 2018 | [Springer](https://link.springer.com/chapter/10.1007/978-3-030-03398-9_30) | [GitHub](https://github.com/MarcWong/UDD) |
| 17 | LEVIR-CD | 变化检测 | 光学 | 637 对 | 5GB | 武汉大学 | 2020 | [IEEE](https://ieeexplore.ieee.org/document/9112775) | [官网](https://justchenhao.github.io/LEVIR/) |
| 18 | WHU-CD | 变化检测 | 光学 | 1 对 | 2GB | 武汉大学 | 2018 | [IEEE](https://ieeexplore.ieee.org/document/8433723) | [武大GPCV](http://gpcv.whu.edu.cn/data/building_dataset.html) |
| 19 | HRSC2016 | 目标检测 | 光学 | 1,070 | 3GB | 西北工大 | 2016 | [IEEE](https://ieeexplore.ieee.org/document/7480356) | [Kaggle](https://www.kaggle.com/datasets/guofeng/hrsc2016) |
| 20 | SSDD | 目标检测 | SAR | 1,163 | 1GB | 西安电子科大 | 2017 | [IEEE](https://ieeexplore.ieee.org/document/8167298) | [GitHub](https://github.com/TianwenZhang0825/Official-SSDD) |

## 分布统计

### 任务类型（5 类）

| 类型 | 数量 | 数据集 |
|------|------|--------|
| 图像分类 | 5 | NWPU-RESISC45, AID, EuroSAT, BigEarthNet, MLRSNet |
| 目标检测 | 6 | DOTA, DIOR, MAR20, FAIR1M, HRSC2016, SSDD |
| 语义分割 | 6 | UAVid, OpenEarthMap, Potsdam, Vaihingen, VDD, UDD |
| 变化检测 | 2 | LEVIR-CD, WHU-CD |
| 实例分割 | 1 | iSAID |

### 数据模态

| 模态 | 数量 |
|------|------|
| 光学 | 14 |
| 多光谱 | 5 |
| SAR | 1 |

### 论文来源

| 来源 | 数量 | 说明 |
|------|------|------|
| arxiv | 12 | 开源免费，推荐优先 |
| IEEE | 4 | 有付费墙，但论文页面可用 |
| 其他 | 4 | 遥感学报/Springer/ISPRS |

## 补充说明

- **Potsdam/Vaihingen**: ISPRS 官方数据集，需申请下载，无独立论文
- **SSDD**: GitHub 旧仓库 404，已找到官方新仓库 `Official-SSDD`
- **MLRSNet**: ScienceDirect 付费墙，已找到 arxiv 替代
- **FAIR1M**: 数据来自高分卫星 + Google Earth，空间分辨率 0.3-0.8m
