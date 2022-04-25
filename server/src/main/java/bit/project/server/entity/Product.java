package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String photo;

    private Integer qty;

    private BigDecimal unitprice;

    private BigDecimal rpqty;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Productstatus productstatus;

    @ManyToOne
    private Productsubcategory productsubcategory;

    @OneToMany(mappedBy="product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Productmaterial> productmaterialList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Customerorderproduct> customerorderproductList;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Customerrefundproduct> customerrefundproductList;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Productdisposalproduct> productdisposalproductList;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Prorder> productProrderList;


    public Product(Integer id){
        this.id = id;
    }

    public Product(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}
