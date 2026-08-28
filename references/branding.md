# 고객 맞춤·브랜딩 규약

인테이크의 고객사 정보가 **시나리오 프레이밍**과 **비주얼**을 동시에 구동한다.

## brief.yaml 고객 블록

```yaml
customer:
  name: "한빛페이"            # 표지·히어로·시나리오 인트로 co-branding
  logo: "assets/customer/hanbitpay.svg"   # 원본 받아서 배치 (없으면 텍스트만)
  industry: "간편결제 PG"     # 시나리오 도메인·데이터셋 성격
  tech_level: L200            # 씬 난이도·설명 밀도·전제 지식
  use_cases:                  # "우리 얘기"로 읽히는 서사의 소재
    - "일 180만 트랜잭션 이상탐지"
    - "정산 배치 SSRF 대응"
```

## 무엇을 구동하는가

| 필드 | 구동 대상 |
|---|---|
| `tech_level` | 씬 난이도, 설명 밀도, `::: warning` 함정의 깊이, 전제 지식 양 |
| `industry` | 시나리오 도메인, 데이터셋 컬럼·값의 현실성, GuardDuty/로그 예시의 업종 적합성 |
| `use_cases` | 시나리오 아크의 뼈대. 각 씬이 최소 하나의 use_case에 대응되게 |
| `name`/`logo` | 홈 히어로, 시나리오 index 인트로, 발표 표지의 co-branding 슬롯 |

## 아이콘·로고 소스

- **AWS 서비스 아이콘**: 공식 AWS Architecture Icons(AWS4)만. `aws-diagram-design` 스킬 번들 또는 drawio AWS4 세트. 검증 안 된 `resIcon`은 렌더 테스트 후 사용.
- **고객 로고**: 고객이 준 원본 또는 공식 브랜드 자산에서. `assets/customer/`에 두고 `docs/public/images/`로 복사. 저해상·왜곡·임의 재색칠 금지.

## 정직 경계 (협상 불가)

- 고객 로고·이름은 **실제 진행하는 고객 워크샵**의 정당한 co-branding 용도에 한한다.
- **날조 금지**: 고객 추천사, 가짜 인용, 존재하지 않는 도입 성과, 고객이 승인하지 않은 로고 사용.
- 데모 데이터가 실제 고객 데이터처럼 보이면 안 됨 — `reference/datasets.md`에 "실제 소스 vs 데모 대체"를 명시(quick-* 관례).
- 고객 로고를 박은 산출물을 외부에 공개·게시하지 않는다(내부 워크샵 자료). 배포는 접근 통제된 곳으로.
