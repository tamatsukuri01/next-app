import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostdata } from "../../lib/posts";

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback || !post) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={post.title}>
      <p className="m-4">
        {"ID: "}
        {post.id}
      </p>
      <p className="mb-8 text-xl font-bold">{post.title}</p>
      <p className="mb-12">{post.created_at}</p>
      <p className="px-10">{post.content}</p>
      <Link href="/Blog">
        <div className="flex cursor-pointer mt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
          <span>Back to blog-page</span>
        </div>
      </Link>
    </Layout>
  );
}

// build時にすべてのIDを取得してくる
export async function getStaticPaths() {
  const paths = await getAllPostIds();

  return {
    paths,
    // falseの場合存在しないIDの場合404ページを出す
    // trueにするとサーバーサイドで静的サイトが生成される
    fallback: true,
  };
}

//
export async function getStaticProps({ params }) {
  const { post: post } = await getPostdata(params.id);
  return {
    props: {
      post,
    },
    // ISR実行時
    // 最新のDBの情報をもとにHTMLの再生性が行われる時間を指定
    revalidate: 3,
  };
}
