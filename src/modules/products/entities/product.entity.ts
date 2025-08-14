export class ProductEntity {
  readonly id?: string;
  name: string;
  description: string;
  price: number;
  status: boolean;
  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;
  constructor(props: Partial<ProductEntity>) {
    Object.assign(this, props);

    if (this.status === undefined) {
      this.status = true;
    }
  }

  static fromDb(row: Partial<ProductEntity>): ProductEntity {
    return new ProductEntity(row);
  }
}
