# 🚀 GitHub Pages デプロイメントガイド

このドキュメントでは、GameHubサイトをGitHub Pagesにデプロイする手順を詳しく説明します。

## 📋 前提条件

- GitHubアカウント
- リポジトリの管理者権限
- Git の基本的な操作知識

## ⚙️ セットアップ手順

### 1. リポジトリの設定

1. **GitHubリポジトリにアクセス**
   ```
   https://github.com/yourusername/repository-name
   ```

2. **Settings タブをクリック**
   - リポジトリページの上部にある「Settings」をクリック

3. **Pages の設定**
   - 左サイドバーの「Pages」をクリック
   - 「Source」セクションで「GitHub Actions」を選択

### 2. GitHub Actions ワークフロー

既に `.github/workflows/deploy.yml` ファイルが設定されています：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. デプロイの実行

1. **変更をコミット**
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflow for Pages deployment"
   git push origin main
   ```

2. **デプロイの確認**
   - リポジトリの「Actions」タブでワークフローの実行状況を確認
   - 緑色のチェックマークが表示されれば成功

3. **サイトのアクセス**
   ```
   https://yourusername.github.io/repository-name/
   ```

## 🔧 トラブルシューティング

### デプロイが失敗する場合

1. **権限の確認**
   - Settings > Actions > General で適切な権限が設定されているか確認

2. **ブランチ名の確認**
   - デフォルトブランチが `main` または `master` になっているか確認

3. **ファイル構造の確認**
   - `index.html` がルートディレクトリにあるか確認

### よくある問題

1. **404 エラー**
   - `index.html` ファイルがルートディレクトリにあることを確認
   - ファイル名の大文字・小文字が正しいか確認

2. **CSS/JSが読み込まれない**
   - 相対パスが正しく設定されているか確認
   - ファイルのパスに日本語が含まれていないか確認

3. **デプロイが遅い**
   - GitHub Pages の反映には数分かかる場合があります
   - キャッシュの影響で古いバージョンが表示される場合があります

## 🌟 カスタマイズ

### カスタムドメインの設定

1. **CNAME ファイルの作成**
   ```
   echo "yourdomain.com" > CNAME
   ```

2. **DNS の設定**
   - ドメインプロバイダーでCNAMEレコードを設定
   - `yourusername.github.io` を指すように設定

### HTTPS の強制

- GitHub Pages では自動的に HTTPS が有効になります
- カスタムドメインの場合も無料のSSL証明書が提供されます

## 📊 モニタリング

### アクセス状況の確認

- GitHub Insights で基本的なアクセス統計を確認できます
- より詳細な分析が必要な場合は Google Analytics の導入を検討

### パフォーマンス最適化

1. **画像の最適化**
   - WebP形式の使用
   - 適切なサイズでの画像配信

2. **CDNの活用**
   - GitHub Pages は世界中のCDNを通じて配信されます

3. **キャッシュの設定**
   - 静的ファイルは自動的にキャッシュされます

## 🔄 継続的デプロイメント

- `main` または `master` ブランチへの変更で自動デプロイ
- プルリクエストでもプレビューが生成されます（設定により）
- ロールバックが必要な場合は前のコミットに戻すことで対応

## 📞 サポート

問題が解決しない場合：

1. [GitHub Pages ドキュメント](https://docs.github.com/pages)を参照
2. [GitHub Actions ドキュメント](https://docs.github.com/actions)を参照
3. GitHubサポートに問い合わせ